import { headers } from "next/headers";

/**
 * Rate limiter sederhana berbasis memori (sliding window).
 *
 * Batasan: state hanya hidup di satu instance server. Di Vercel (serverless)
 * tiap instance punya hitungan sendiri dan reset saat cold start, jadi ini
 * pengaman dasar terhadap spam/brute force, bukan jaminan mutlak. Untuk
 * perlindungan lebih kuat, pindahkan ke Upstash Redis atau tabel Supabase.
 */
const hits = new Map<string, number[]>();
const MAX_KEYS = 5000;

export type RateLimitResult = { ok: boolean; retryAfterSec: number };

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);

  if (recent.length >= limit) {
    hits.set(key, recent);
    return {
      ok: false,
      retryAfterSec: Math.ceil((windowMs - (now - recent[0])) / 1000),
    };
  }

  recent.push(now);
  hits.set(key, recent);

  if (hits.size > MAX_KEYS) {
    for (const [k, times] of hits) {
      if (times.every((t) => now - t >= windowMs)) hits.delete(k);
    }
  }

  return { ok: true, retryAfterSec: 0 };
}

export async function getClientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return h.get("x-real-ip") ?? "unknown";
}

export function waitMessage(retryAfterSec: number): string {
  const minutes = Math.ceil(retryAfterSec / 60);
  return `Terlalu banyak percobaan. Coba lagi dalam ${minutes} menit.`;
}
