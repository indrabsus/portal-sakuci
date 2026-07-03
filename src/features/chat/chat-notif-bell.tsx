'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { MessageCircle } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { getPercakapan } from './actions'
import type { Pesan } from './types'

export function ChatNotifBell({ currentUserId }: { currentUserId: string }) {
  const [totalUnread, setTotalUnread] = useState(0)
  const supabase = createClient()
  // Track apakah panel chat sedang terbuka (untuk skip toast)
  const chatOpenRef = useRef(false)

  const refreshUnread = useCallback(async () => {
    const list = await getPercakapan()
    setTotalUnread(list.reduce((s, p) => s + p.unread_count, 0))
  }, [])

  useEffect(() => {
    refreshUnread()
  }, [refreshUnread])

  // Sync status open dari FloatingChat via CustomEvent
  useEffect(() => {
    const onOpen = () => { chatOpenRef.current = true }
    const onClose = () => {
      chatOpenRef.current = false
      // Refresh unread saat chat ditutup
      refreshUnread()
    }
    window.addEventListener('chat:opened', onOpen)
    window.addEventListener('chat:closed', onClose)
    return () => {
      window.removeEventListener('chat:opened', onOpen)
      window.removeEventListener('chat:closed', onClose)
    }
  }, [refreshUnread])

  // Realtime: dengarkan pesan baru
  useEffect(() => {
    const channel = supabase
      .channel('chat-notif-bell')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_pesan' },
        async (payload) => {
          const msg = payload.new as Pesan
          if (msg.id_pengirim === currentUserId) return

          // Update badge
          setTotalUnread(prev => prev + 1)

          // Tampilkan toast hanya jika panel chat tidak sedang terbuka
          if (!chatOpenRef.current) {
            // Ambil nama pengirim dari percakapan yang ada
            const list = await getPercakapan()
            const percakapan = list.find(p => p.id === msg.id_percakapan)
            const nama = percakapan?.lawan_bicara.nama ?? 'Seseorang'
            const preview = msg.isi.length > 60 ? msg.isi.slice(0, 60) + '…' : msg.isi

            toast.message(`💬 Pesan dari ${nama}`, {
              description: preview,
              duration: 5000,
              action: {
                label: 'Buka',
                onClick: () => window.dispatchEvent(new CustomEvent('chat:open')),
              },
            })
          }
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [currentUserId, supabase])

  const handleClick = () => {
    window.dispatchEvent(new CustomEvent('chat:open'))
  }

  return (
    <button
      onClick={handleClick}
      aria-label="Buka chat"
      className="relative p-2 rounded-lg hover:bg-accent transition-colors"
    >
      <MessageCircle className="size-4 text-muted-foreground" />
      {totalUnread > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-red-500 rounded-full flex items-center justify-center text-[9px] text-white font-bold px-0.5 leading-none">
          {totalUnread > 99 ? '99+' : totalUnread}
        </span>
      )}
    </button>
  )
}
