import type { Metadata } from "next";

export const metadata: Metadata = { title: "Lacak Pesanan" };

export default function LacakPage() {
  return (
    <main className="mx-auto max-w-xl px-5 py-20 text-center">
      <h1 className="text-4xl font-semibold">Lacak Pesanan</h1>
      <p className="mt-3 text-ink/75">
        Fitur pelacakan pesanan segera hadir. Untuk sementara, tanyakan progres
        langsung lewat WhatsApp.
      </p>
    </main>
  );
}
