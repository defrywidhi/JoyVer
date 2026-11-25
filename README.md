# JoyVer

We Create Joy. Katalog jasa kreatif dengan order lewat WhatsApp dan pelacakan pesanan.

Acuan lengkap proyek: [`PROJECT_BRIEF.md`](./PROJECT_BRIEF.md)

## Menjalankan lokal

```bash
npm install
cp .env.example .env.local   # isi kunci Supabase, URL situs, dan Resend (opsional lokal)
npm run dev
```

Buka http://localhost:3000.

## Menyiapkan Supabase

1. Buat proyek di https://supabase.com.
2. Jalankan `supabase/migrations/0001_init.sql` di SQL Editor.
3. Jalankan `supabase/migrations/0002_admin_notification_email.sql` untuk menambah pengaturan email penerima admin. Jika migration `0001_init.sql` sudah pernah dijalankan, cukup jalankan migration `0002`.
4. (Opsional) Jalankan `supabase/seed.sql` untuk data contoh.
5. Buat user admin di Authentication, lalu daftarkan UUID-nya ke tabel `admins`
   (perintahnya ada di bagian bawah `seed.sql`).
6. Salin URL dan anon key ke `.env.local`.

## Notifikasi email order baru (Resend)

Notifikasi email bersifat best-effort. Order disimpan lebih dulu; pengiriman
email dijalankan setelah response agar pelanggan tetap langsung diarahkan ke
WhatsApp. Jika API key kosong atau Resend gagal, order tetap berjalan normal.

1. Buat akun di [Resend](https://resend.com) dan verifikasi domain pengirim.
2. Buat API key, lalu isi variabel berikut di `.env.local` dan Vercel:
   - `RESEND_API_KEY`: API key dari Resend.
   - `RESEND_FROM_EMAIL`: alamat pengirim pada domain terverifikasi, misalnya
     `JoyVer <notifikasi@domain-anda.id>`.
   - `ADMIN_NOTIFICATION_EMAIL`: alamat admin penerima notifikasi.
   - `NEXT_PUBLIC_SITE_URL`: URL website publik, tanpa slash di akhir.
3. Atur penerima yang diprioritaskan lewat dashboard `/admin/pengaturan` pada
   field **Email Notifikasi Admin**. Jika kosong, aplikasi memakai
   `ADMIN_NOTIFICATION_EMAIL` dari environment.
4. Jika pengaturan Resend belum lengkap atau pengiriman gagal, error hanya
   dicatat di log server dan tidak membatalkan order.

Email order baru berisi kode order, nama dan WhatsApp pelanggan, layanan,
detail kebutuhan, serta tautan langsung ke halaman detail admin berdasarkan kode
order. Untuk membuka pengaturan penerima dari dashboard, jalankan migration
`0002_admin_notification_email.sql` terlebih dahulu.

## Struktur

```
src/
  app/            Halaman (App Router), layout, tema global
  lib/
    site.ts       Konfigurasi situs, label status, helper WhatsApp/Rupiah
    email.ts      Notifikasi order baru via Resend (best-effort)
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
