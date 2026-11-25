export const siteConfig = {
  name: "JoyVer",
  tagline: "We Create Joy",
  description:
    "Undangan digital, website usaha, dan buket bunga yang dibuat dengan sepenuh hati.",
  keywords: [
    "JoyVer",
    "undangan digital",
    "website undangan",
    "jasa pembuatan website",
    "website usaha",
    "buket bunga",
    "jasa kreatif",
  ],
  locale: "id_ID",
  values: "Cultivate relationship, and invite good fortune to grow.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;

export const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/layanan", label: "Layanan" },
  { href: "/tim", label: "Tim" },
  { href: "/lacak", label: "Lacak Pesanan" },
] as const;

export const ORDER_STATUS_LABEL = {
  menunggu_konfirmasi: "Menunggu konfirmasi",
  deal: "Deal",
  dikerjakan: "Dikerjakan",
  selesai: "Selesai",
  dibatalkan: "Dibatalkan",
} as const;

export type OrderStatus = keyof typeof ORDER_STATUS_LABEL;

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  }).format(new Date(iso));
}

export function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

/** Normalisasi nomor WA ke 62xxxxxxxxxx (sama dengan fungsi SQL normalize_wa). */
export function normalizeWa(raw: string): string {
  let d = raw.replace(/\D/g, "");
  if (d.startsWith("0")) d = "62" + d.slice(1);
  else if (d.startsWith("8")) d = "62" + d;
  return d;
}

/** Buat tautan wa.me dengan pesan terisi. `wa` harus format 62xxxxxxxxxx. */
export function buildWhatsAppUrl(wa: string, message: string): string {
  return `https://wa.me/${wa}?text=${encodeURIComponent(message)}`;
}
