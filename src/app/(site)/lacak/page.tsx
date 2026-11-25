import type { Metadata } from "next";
import { TrackForm } from "@/components/TrackForm";

export const metadata: Metadata = {
  title: "Lacak Pesanan",
  description: "Cek status dan progres pesanan JoyVer Anda dengan kode order.",
  alternates: { canonical: "/lacak" },
  robots: { index: false, follow: false },
};

export default function LacakPage() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-12">
      <h1 className="text-4xl font-semibold">Lacak Pesanan</h1>
      <p className="mt-2 mb-8 text-ink/75">
        Masukkan kode order (dikirim lewat WhatsApp) dan nomor WhatsApp yang
        Anda gunakan saat memesan.
      </p>
      <TrackForm />
    </main>
  );
}
