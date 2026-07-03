'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { ChatUser, Percakapan, Pesan } from './types'

// Ambil nama + role dari profile id (pakai admin client untuk bypass RLS on profiles)
async function resolveUser(id_profile: string): Promise<ChatUser> {
  const admin = createAdminClient()
  const { data } = await admin
    .from('profiles')
    .select('id_profile, foto, nama_lengkap, roles(nama_role)')
    .eq('id_profile', id_profile)
    .single()

  return {
    id_profile,
    nama: data?.nama_lengkap ?? 'Pengguna',
    role: (data?.roles as unknown as { nama_role: string } | null)?.nama_role as ChatUser['role'] ?? 'siswa',
    foto: data?.foto ?? null,
  }
}

// Cari user by nama (lintas role), kecuali diri sendiri
export async function searchUsers(query: string): Promise<ChatUser[]> {
  if (!query.trim()) return []
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const admin = createAdminClient()
  const { data } = await admin
    .from('profiles')
    .select('id_profile, foto, nama_lengkap, roles(nama_role)')
    .ilike('nama_lengkap', `%${query}%`)
    .neq('id_profile', user.id)
    .eq('aktif', true)
    .limit(15)

  return (data ?? []).map(p => ({
    id_profile: p.id_profile,
    nama: p.nama_lengkap ?? 'Pengguna',
    role: (p.roles as unknown as { nama_role: string } | null)?.nama_role as ChatUser['role'] ?? 'siswa',
    foto: p.foto ?? null,
  }))
}

// Ambil semua percakapan milik user + unread count
export async function getPercakapan(): Promise<Percakapan[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data: rows } = await supabase
    .from('chat_percakapan')
    .select('id, peserta_1, peserta_2, pesan_terakhir, waktu_pesan_terakhir')
    .or(`peserta_1.eq.${user.id},peserta_2.eq.${user.id}`)
    .order('waktu_pesan_terakhir', { ascending: false, nullsFirst: false })

  if (!rows?.length) return []

  // Ambil semua last_read user ini sekaligus
  const { data: bacaRows } = await supabase
    .from('chat_baca')
    .select('id_percakapan, last_read_at')
    .eq('id_user', user.id)

  const bacaMap = new Map<string, string>(
    (bacaRows ?? []).map(b => [b.id_percakapan, b.last_read_at])
  )

  // Hitung unread per percakapan
  const unreadCounts = await Promise.all(
    rows.map(async (row) => {
      const lastRead = bacaMap.get(row.id) ?? '1970-01-01'
      const { count } = await supabase
        .from('chat_pesan')
        .select('id', { count: 'exact', head: true })
        .eq('id_percakapan', row.id)
        .neq('id_pengirim', user.id)
        .gt('created_at', lastRead)
      return count ?? 0
    })
  )

  const percakapan = await Promise.all(
    rows.map(async (row, i) => {
      const lawanId = row.peserta_1 === user.id ? row.peserta_2 : row.peserta_1
      const lawan = await resolveUser(lawanId)
      return {
        id: row.id,
        lawan_bicara: lawan,
        pesan_terakhir: row.pesan_terakhir,
        waktu_pesan_terakhir: row.waktu_pesan_terakhir,
        unread_count: unreadCounts[i],
      } satisfies Percakapan
    })
  )

  return percakapan
}

// Ambil atau buat percakapan antara dua user
export async function getOrCreatePercakapan(targetId: string): Promise<string | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // Pastikan peserta_1 < peserta_2 (constraint DB)
  const [p1, p2] = [user.id, targetId].sort()

  const { data: existing } = await supabase
    .from('chat_percakapan')
    .select('id')
    .eq('peserta_1', p1)
    .eq('peserta_2', p2)
    .single()

  if (existing) return existing.id

  const { data: created } = await supabase
    .from('chat_percakapan')
    .insert({ peserta_1: p1, peserta_2: p2 })
    .select('id')
    .single()

  return created?.id ?? null
}

// Ambil pesan dalam satu percakapan (50 terakhir)
export async function getPesan(id_percakapan: string): Promise<Pesan[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('chat_pesan')
    .select('id, id_percakapan, id_pengirim, isi, created_at')
    .eq('id_percakapan', id_percakapan)
    .order('created_at', { ascending: true })
    .limit(50)

  return data ?? []
}

// Kirim pesan
export async function kirimPesan(id_percakapan: string, isi: string): Promise<Pesan | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isi.trim()) return null

  const trimmed = isi.trim().slice(0, 2000)

  const { data: pesan } = await supabase
    .from('chat_pesan')
    .insert({ id_percakapan, id_pengirim: user.id, isi: trimmed })
    .select('id, id_percakapan, id_pengirim, isi, created_at')
    .single()

  if (pesan) {
    // Update snapshot pesan terakhir di percakapan
    await supabase
      .from('chat_percakapan')
      .update({ pesan_terakhir: trimmed, waktu_pesan_terakhir: pesan.created_at })
      .eq('id', id_percakapan)
  }

  return pesan
}

// Tandai sudah dibaca (upsert last_read_at)
export async function tandaiDibaca(id_percakapan: string): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase
    .from('chat_baca')
    .upsert(
      { id_percakapan, id_user: user.id, last_read_at: new Date().toISOString() },
      { onConflict: 'id_percakapan,id_user' }
    )
}

// Total unread untuk badge
export async function getTotalUnread(): Promise<number> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return 0

  const { data: percakapanList } = await supabase
    .from('chat_percakapan')
    .select('id')
    .or(`peserta_1.eq.${user.id},peserta_2.eq.${user.id}`)

  if (!percakapanList?.length) return 0

  const { data: bacaRows } = await supabase
    .from('chat_baca')
    .select('id_percakapan, last_read_at')
    .eq('id_user', user.id)

  const bacaMap = new Map<string, string>(
    (bacaRows ?? []).map(b => [b.id_percakapan, b.last_read_at])
  )

  let total = 0
  for (const p of percakapanList) {
    const lastRead = bacaMap.get(p.id) ?? '1970-01-01'
    const { count } = await supabase
      .from('chat_pesan')
      .select('id', { count: 'exact', head: true })
      .eq('id_percakapan', p.id)
      .neq('id_pengirim', user.id)
      .gt('created_at', lastRead)
    total += count ?? 0
  }
  return total
}
