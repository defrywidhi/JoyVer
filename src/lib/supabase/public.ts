import { createClient } from "@supabase/supabase-js";

/**
 * Klien anon tanpa cookie/sesi, khusus membaca data publik.
 * Tidak memakai `cookies()`, sehingga halaman yang memakainya bisa
 * di-cache statis (ISR). Jangan dipakai untuk data milik admin.
 */
export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
