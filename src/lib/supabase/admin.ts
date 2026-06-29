import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Pakai service role key — hanya untuk operasi server-side terbatas:
// aktivasi akun, reset password, backup/restore. JANGAN pernah diimpor
// dari Client Component atau dikirim ke browser.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
