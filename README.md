# JoyVer

We Create Joy. Katalog jasa kreatif dengan order lewat WhatsApp dan pelacakan pesanan.

Acuan lengkap proyek: [`PROJECT_BRIEF.md`](./PROJECT_BRIEF.md)

## Menjalankan lokal

```bash
npm install
cp .env.example .env.local   # isi kunci Supabase
npm run dev
```

Buka http://localhost:3000.

## Menyiapkan Supabase

1. Buat proyek di https://supabase.com.
2. Jalankan `supabase/migrations/0001_init.sql` di SQL Editor.
3. (Opsional) Jalankan `supabase/seed.sql` untuk data contoh.
4. Buat user admin di Authentication, lalu daftarkan UUID-nya ke tabel `admins`
   (perintahnya ada di bagian bawah `seed.sql`).
5. Salin URL dan anon key ke `.env.local`.

## Struktur

```
src/
  app/            Halaman (App Router), layout, tema global
  lib/
    site.ts       Konfigurasi situs, label status, helper WhatsApp/Rupiah
    supabase/     Klien Supabase (browser dan server)
supabase/
  migrations/     Skema database + RLS
  seed.sql        Data contoh
```

## Perintah

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Server pengembangan |
| `npm run build` | Build produksi |
| `npm run lint` | Lint |
| `npm run typecheck` | Cek tipe TypeScript |
