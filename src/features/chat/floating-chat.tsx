'use client'

import { useEffect, useRef, useState, useCallback, useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'
import { MessageCircle, X, ArrowLeft, Send, Search, Loader2 } from 'lucide-react'
import {
  getPercakapan,
  getOrCreatePercakapan,
  getPesan,
  kirimPesan,
  tandaiDibaca,
  searchUsers,
} from './actions'
import type { ChatUser, Percakapan, Pesan } from './types'

// ── helpers ──────────────────────────────────────────────────────────────────

const ROLE_LABEL: Record<string, string> = {
  admin: 'Admin',
  kajur: 'Kajur',
  guru: 'Guru',
  siswa: 'Siswa',
  bkk: 'BKK',
}

const ROLE_COLOR: Record<string, string> = {
  admin: 'bg-red-500/20 text-red-400',
  kajur: 'bg-purple-500/20 text-purple-400',
  guru: 'bg-blue-500/20 text-blue-400',
  siswa: 'bg-green-500/20 text-green-400',
  bkk: 'bg-amber-500/20 text-amber-400',
}

function Avatar({ nama, foto, size = 8 }: { nama: string; foto?: string | null; size?: number }) {
  const initials = nama
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase()
  const cls = `w-${size} h-${size} rounded-full flex items-center justify-center text-xs font-bold shrink-0`
  if (foto) return <img src={foto} alt={nama} className={`${cls} object-cover`} />
  return (
    <div className={`${cls} bg-indigo-600/30 text-indigo-300 border border-indigo-500/30`}>
      {initials}
    </div>
  )
}

function formatTime(iso: string | null) {
  if (!iso) return ''
  const d = new Date(iso)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000)
  if (diffDays === 0) return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  if (diffDays === 1) return 'Kemarin'
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
}

// Render teks dengan link otomatis
function MessageText({ text }: { text: string }) {
  const urlRegex = /https?:\/\/[^\s<>"]+/g
  const parts: (string | { url: string; key: number })[] = []
  let last = 0
  let match: RegExpExecArray | null
  let key = 0
  while ((match = urlRegex.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index))
    parts.push({ url: match[0], key: key++ })
    last = match.index + match[0].length
  }
  if (last < text.length) parts.push(text.slice(last))
  return (
    <>
      {parts.map((p, i) =>
        typeof p === 'string' ? (
          <span key={i}>{p}</span>
        ) : (
          <a
            key={p.key}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-indigo-400/60 text-indigo-300 hover:text-indigo-200 break-all"
            onClick={e => e.stopPropagation()}
          >
            {p.url}
          </a>
        )
      )}
    </>
  )
}

// ── main component ────────────────────────────────────────────────────────────

type View = 'list' | 'thread' | 'search'

export function FloatingChat({ currentUserId }: { currentUserId: string }) {
  const [open, setOpen] = useState(false)
  const [view, setView] = useState<View>('list')
  const [totalUnread, setTotalUnread] = useState(0)

  const [percakapanList, setPercakapanList] = useState<Percakapan[]>([])
  const [activePercakapan, setActivePercakapan] = useState<Percakapan | null>(null)
  const [pesan, setPesan] = useState<Pesan[]>([])
  const [input, setInput] = useState('')

  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<ChatUser[]>([])
  const [searchLoading, setSearchLoading] = useState(false)

  const [sending, startSending] = useTransition()
  const [loadingThread, setLoadingThread] = useState(false)

  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const supabase = createClient()

  // Hitung total unread badge
  const refreshUnread = useCallback(async () => {
    if (!open) {
      const list = await getPercakapan()
      const total = list.reduce((s, p) => s + p.unread_count, 0)
      setTotalUnread(total)
      setPercakapanList(list)
    }
  }, [open])

  // Muat daftar percakapan
  const loadList = useCallback(async () => {
    const list = await getPercakapan()
    setPercakapanList(list)
    setTotalUnread(list.reduce((s, p) => s + p.unread_count, 0))
  }, [])

  useEffect(() => {
    loadList()
  }, [loadList])

  // Sync open state ke ChatNotifBell via CustomEvent
  useEffect(() => {
    window.dispatchEvent(new CustomEvent(open ? 'chat:opened' : 'chat:closed'))
  }, [open])

  // Listen event dari ChatNotifBell / toast action
  useEffect(() => {
    const handler = () => { setOpen(true); setView('list'); loadList() }
    window.addEventListener('chat:open', handler)
    return () => window.removeEventListener('chat:open', handler)
  }, [loadList])

  // Realtime: pesan masuk dari percakapan manapun
  useEffect(() => {
    const channel = supabase
      .channel('chat-global')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_pesan' },
        (payload) => {
          const msg = payload.new as Pesan
          // Kalau pesan ini bukan dari diri sendiri
          if (msg.id_pengirim === currentUserId) return

          // Jika thread aktif = percakapan ini → append & tandai baca
          if (activePercakapan && msg.id_percakapan === activePercakapan.id) {
            setPesan(prev => [...prev, msg])
            tandaiDibaca(msg.id_percakapan)
            setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
          } else {
            // Refresh daftar & badge
            loadList()
          }
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [currentUserId, activePercakapan, loadList, supabase])

  // Scroll to bottom saat thread terbuka
  useEffect(() => {
    if (view === 'thread') {
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'instant' }), 50)
    }
  }, [view, pesan.length])

  // Search debounce
  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return }
    const t = setTimeout(async () => {
      setSearchLoading(true)
      const res = await searchUsers(searchQuery)
      setSearchResults(res)
      setSearchLoading(false)
    }, 300)
    return () => clearTimeout(t)
  }, [searchQuery])

  const openThread = async (p: Percakapan) => {
    setActivePercakapan(p)
    setView('thread')
    setLoadingThread(true)
    const msgs = await getPesan(p.id)
    setPesan(msgs)
    setLoadingThread(false)
    await tandaiDibaca(p.id)
    // Update unread di list
    setPercakapanList(prev =>
      prev.map(item => item.id === p.id ? { ...item, unread_count: 0 } : item)
    )
    setTotalUnread(prev => Math.max(0, prev - p.unread_count))
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const startNewChat = async (user: ChatUser) => {
    const id = await getOrCreatePercakapan(user.id_profile)
    if (!id) return
    const fakePercakapan: Percakapan = {
      id,
      lawan_bicara: user,
      pesan_terakhir: null,
      waktu_pesan_terakhir: null,
      unread_count: 0,
    }
    setActivePercakapan(fakePercakapan)
    setView('thread')
    setSearchQuery('')
    setSearchResults([])
    setLoadingThread(true)
    const msgs = await getPesan(id)
    setPesan(msgs)
    setLoadingThread(false)
    await loadList()
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const handleSend = () => {
    if (!input.trim() || !activePercakapan) return
    const text = input.trim()
    setInput('')
    const optimistic: Pesan = {
      id: `opt-${Date.now()}`,
      id_percakapan: activePercakapan.id,
      id_pengirim: currentUserId,
      isi: text,
      created_at: new Date().toISOString(),
    }
    setPesan(prev => [...prev, optimistic])
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 30)

    startSending(async () => {
      await kirimPesan(activePercakapan.id, text)
      await loadList()
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const goBack = () => {
    setView('list')
    setActivePercakapan(null)
    setPesan([])
    loadList()
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2">
      {/* Panel */}
      {open && (
        <div className="w-[340px] h-[520px] flex flex-col rounded-2xl shadow-2xl border border-white/10 bg-[oklch(0.16_0.02_265)] overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-2 px-4 py-3 bg-indigo-600 shrink-0">
            {view === 'thread' && (
              <button onClick={goBack} className="p-1 rounded hover:bg-white/20 transition-colors mr-1">
                <ArrowLeft size={16} className="text-white" />
              </button>
            )}
            {view === 'thread' && activePercakapan ? (
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Avatar nama={activePercakapan.lawan_bicara.nama} foto={activePercakapan.lawan_bicara.foto} size={7} />
                <div className="min-w-0">
                  <p className="text-white text-sm font-semibold truncate leading-tight">
                    {activePercakapan.lawan_bicara.nama}
                  </p>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${ROLE_COLOR[activePercakapan.lawan_bicara.role] ?? 'bg-white/20 text-white'}`}>
                    {ROLE_LABEL[activePercakapan.lawan_bicara.role] ?? activePercakapan.lawan_bicara.role}
                  </span>
                </div>
              </div>
            ) : (
              <span className="text-white font-semibold flex-1 text-sm">Pesan</span>
            )}
            <button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-white/20 transition-colors">
              <X size={16} className="text-white" />
            </button>
          </div>

          {/* Search bar (hanya di view list) */}
          {view !== 'thread' && (
            <div className="px-3 py-2 border-b border-white/5 bg-[oklch(0.18_0.02_265)] shrink-0">
              <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-1.5">
                <Search size={14} className="text-white/40 shrink-0" />
                <input
                  type="text"
                  placeholder="Cari nama pengguna..."
                  value={searchQuery}
                  onChange={e => { setSearchQuery(e.target.value); setView('search') }}
                  onFocus={() => setView('search')}
                  className="bg-transparent text-white text-sm placeholder:text-white/30 outline-none flex-1 min-w-0"
                />
                {searchLoading && <Loader2 size={12} className="text-white/40 animate-spin shrink-0" />}
                {searchQuery && (
                  <button onClick={() => { setSearchQuery(''); setSearchResults([]); setView('list') }}
                    className="text-white/40 hover:text-white/70">
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Body */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {/* VIEW: search results */}
            {view === 'search' && (
              <div>
                {searchResults.length === 0 && !searchLoading && searchQuery && (
                  <p className="text-white/30 text-xs text-center py-8">Tidak ada hasil untuk "{searchQuery}"</p>
                )}
                {searchResults.map(u => (
                  <button
                    key={u.id_profile}
                    onClick={() => startNewChat(u)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
                  >
                    <Avatar nama={u.nama} foto={u.foto} size={8} />
                    <div className="min-w-0 flex-1">
                      <p className="text-white text-sm font-medium truncate">{u.nama}</p>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${ROLE_COLOR[u.role] ?? 'bg-white/20 text-white'}`}>
                        {ROLE_LABEL[u.role] ?? u.role}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* VIEW: conversation list */}
            {view === 'list' && (
              <div>
                {percakapanList.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full py-16 gap-3">
                    <MessageCircle size={32} className="text-white/20" />
                    <p className="text-white/30 text-xs text-center">Belum ada percakapan.<br />Cari nama untuk mulai chat.</p>
                  </div>
                ) : (
                  percakapanList.map(p => (
                    <button
                      key={p.id}
                      onClick={() => openThread(p)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left border-b border-white/[0.04]"
                    >
                      <div className="relative shrink-0">
                        <Avatar nama={p.lawan_bicara.nama} foto={p.lawan_bicara.foto} size={9} />
                        {p.unread_count > 0 && (
                          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[9px] text-white font-bold">
                            {p.unread_count > 9 ? '9+' : p.unread_count}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-1">
                          <p className={`text-sm truncate ${p.unread_count > 0 ? 'text-white font-semibold' : 'text-white/80 font-medium'}`}>
                            {p.lawan_bicara.nama}
                          </p>
                          <span className="text-white/30 text-[10px] shrink-0">
                            {formatTime(p.waktu_pesan_terakhir)}
                          </span>
                        </div>
                        <p className={`text-xs truncate ${p.unread_count > 0 ? 'text-white/70' : 'text-white/35'}`}>
                          {p.pesan_terakhir ?? 'Mulai percakapan'}
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}

            {/* VIEW: thread */}
            {view === 'thread' && (
              <div className="flex flex-col gap-1 px-3 py-3">
                {loadingThread && (
                  <div className="flex justify-center py-8">
                    <Loader2 size={20} className="text-white/30 animate-spin" />
                  </div>
                )}
                {!loadingThread && pesan.length === 0 && (
                  <p className="text-white/25 text-xs text-center py-8">
                    Kirim pesan pertama ke {activePercakapan?.lawan_bicara.nama}
                  </p>
                )}
                {pesan.map(m => {
                  const isMine = m.id_pengirim === currentUserId
                  return (
                    <div key={m.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[78%] px-3 py-2 rounded-2xl text-sm leading-relaxed break-words
                        ${isMine
                          ? 'bg-indigo-600 text-white rounded-br-sm'
                          : 'bg-white/10 text-white/90 rounded-bl-sm'
                        }`}>
                        <MessageText text={m.isi} />
                        <p className={`text-[9px] mt-0.5 ${isMine ? 'text-indigo-200/60 text-right' : 'text-white/30'}`}>
                          {formatTime(m.created_at)}
                        </p>
                      </div>
                    </div>
                  )
                })}
                <div ref={bottomRef} />
              </div>
            )}
          </div>

          {/* Input area (hanya di thread) */}
          {view === 'thread' && (
            <div className="px-3 py-2 border-t border-white/5 bg-[oklch(0.18_0.02_265)] shrink-0">
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ketik pesan... (Enter kirim)"
                  rows={1}
                  className="flex-1 bg-white/5 text-white text-sm placeholder:text-white/25 rounded-xl px-3 py-2 outline-none resize-none max-h-24 overflow-y-auto leading-relaxed"
                  style={{ fieldSizing: 'content' } as React.CSSProperties}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || sending}
                  className="p-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-colors shrink-0"
                >
                  {sending ? <Loader2 size={16} className="text-white animate-spin" /> : <Send size={16} className="text-white" />}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-13 h-13 bg-indigo-600 hover:bg-indigo-500 rounded-full shadow-lg shadow-indigo-900/40 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 relative"
        aria-label="Buka chat"
      >
        {open ? <X size={22} className="text-white" /> : <MessageCircle size={22} className="text-white" />}
        {!open && totalUnread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold px-1 shadow">
            {totalUnread > 99 ? '99+' : totalUnread}
          </span>
        )}
      </button>
    </div>
  )
}
