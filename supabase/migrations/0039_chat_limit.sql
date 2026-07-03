-- ============================================================
-- Chat: retensi 30 hari + cleanup otomatis via pg_cron
-- ============================================================

-- Aktifkan pg_cron (sudah tersedia di Supabase, tinggal enable)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Index pada created_at supaya DELETE cepat
CREATE INDEX IF NOT EXISTS idx_chat_pesan_created_at ON public.chat_pesan (created_at);

-- Cron job: tiap malam jam 01:00 WIB (18:00 UTC), hapus pesan > 30 hari
SELECT cron.schedule(
  'hapus-chat-lama',           -- nama job (unik)
  '0 18 * * *',                -- setiap hari jam 18:00 UTC = 01:00 WIB
  $$
    DELETE FROM public.chat_pesan
    WHERE created_at < now() - interval '30 days';
  $$
);
