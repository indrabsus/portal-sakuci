-- ============================================================
-- Chat 1-on-1 realtime antar semua role
-- ============================================================

-- Percakapan antara dua user (peserta_1 < peserta_2 selalu, mencegah duplikat)
CREATE TABLE public.chat_percakapan (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  peserta_1            uuid NOT NULL REFERENCES public.profiles(id_profile) ON DELETE CASCADE,
  peserta_2            uuid NOT NULL REFERENCES public.profiles(id_profile) ON DELETE CASCADE,
  pesan_terakhir       text,
  waktu_pesan_terakhir timestamptz,
  created_at           timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chat_peserta_berbeda CHECK (peserta_1 <> peserta_2),
  CONSTRAINT chat_peserta_order   CHECK (peserta_1 < peserta_2),
  UNIQUE (peserta_1, peserta_2)
);

-- Pesan dalam percakapan
CREATE TABLE public.chat_pesan (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  id_percakapan    uuid NOT NULL REFERENCES public.chat_percakapan(id) ON DELETE CASCADE,
  id_pengirim      uuid NOT NULL REFERENCES public.profiles(id_profile) ON DELETE CASCADE,
  isi              text NOT NULL CHECK (char_length(isi) BETWEEN 1 AND 2000),
  created_at       timestamptz NOT NULL DEFAULT now()
);

-- Tracker last-read per user per percakapan (untuk unread count)
CREATE TABLE public.chat_baca (
  id_percakapan uuid NOT NULL REFERENCES public.chat_percakapan(id) ON DELETE CASCADE,
  id_user       uuid NOT NULL REFERENCES public.profiles(id_profile) ON DELETE CASCADE,
  last_read_at  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (id_percakapan, id_user)
);

-- Indexes
CREATE INDEX idx_chat_percakapan_peserta_1 ON public.chat_percakapan (peserta_1);
CREATE INDEX idx_chat_percakapan_peserta_2 ON public.chat_percakapan (peserta_2);
CREATE INDEX idx_chat_pesan_percakapan     ON public.chat_pesan (id_percakapan, created_at);
CREATE INDEX idx_chat_pesan_pengirim       ON public.chat_pesan (id_pengirim);

-- RLS
ALTER TABLE public.chat_percakapan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_pesan      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_baca       ENABLE ROW LEVEL SECURITY;

-- chat_percakapan: hanya peserta yang bisa lihat/buat/update
CREATE POLICY "chat_percakapan_select" ON public.chat_percakapan
  FOR SELECT USING (peserta_1 = auth.uid() OR peserta_2 = auth.uid());

CREATE POLICY "chat_percakapan_insert" ON public.chat_percakapan
  FOR INSERT WITH CHECK (peserta_1 = auth.uid() OR peserta_2 = auth.uid());

CREATE POLICY "chat_percakapan_update" ON public.chat_percakapan
  FOR UPDATE USING (peserta_1 = auth.uid() OR peserta_2 = auth.uid());

-- chat_pesan: hanya peserta percakapan yang bisa baca; hanya pengirim yang bisa insert
CREATE POLICY "chat_pesan_select" ON public.chat_pesan
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.chat_percakapan p
      WHERE p.id = chat_pesan.id_percakapan
        AND (p.peserta_1 = auth.uid() OR p.peserta_2 = auth.uid())
    )
  );

CREATE POLICY "chat_pesan_insert" ON public.chat_pesan
  FOR INSERT WITH CHECK (
    id_pengirim = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.chat_percakapan p
      WHERE p.id = chat_pesan.id_percakapan
        AND (p.peserta_1 = auth.uid() OR p.peserta_2 = auth.uid())
    )
  );

-- chat_baca: user hanya bisa manage milik sendiri
CREATE POLICY "chat_baca_all" ON public.chat_baca
  FOR ALL USING (id_user = auth.uid());

-- Aktifkan Realtime untuk chat_pesan
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_pesan;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_percakapan;
