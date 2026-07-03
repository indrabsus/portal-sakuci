export type RoleLabel = 'admin' | 'kajur' | 'guru' | 'siswa' | 'bkk'

export interface ChatUser {
  id_profile: string
  nama: string
  role: RoleLabel
  foto: string | null
}

export interface Percakapan {
  id: string
  lawan_bicara: ChatUser
  pesan_terakhir: string | null
  waktu_pesan_terakhir: string | null
  unread_count: number
}

export interface Pesan {
  id: string
  id_percakapan: string
  id_pengirim: string
  isi: string
  created_at: string
}
