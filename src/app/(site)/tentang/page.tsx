import type { Metadata } from "next";
import Link from "next/link";
import { CloverIcon } from "@/components/Logo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description: "Kenali JoyVer: layanan kreatif yang membantu menghadirkan kebahagiaan di setiap momen.",
  alternates: { canonical: "/tentang" },
};

export default function TentangPage() {
  return (
    <main className="mx-auto max-w-4xl px-5 py-14">
      <div className="rounded-card bg-clover-soft px-6 py-12 text-center md:px-12">
        <CloverIcon className="mx-auto size-14 text-clover-green" />
        <p className="mt-4 text-sm font-semibold tracking-widest text-clover-green uppercase">
          Joy + Clover
        </p>
        <h1 className="mt-2 text-4xl font-semibold">Tentang JoyVer</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-ink/80">
          JoyVer lahir dari keinginan untuk membuat karya yang membawa kebahagiaan,
          merawat hubungan, dan membuka ruang bagi hal-hal baik untuk tumbuh.
        </p>
        <p className="mt-5 font-heading text-2xl font-semibold text-deep-green">
          {siteConfig.values}
        </p>
      </div>

      <section className="mt-10 space-y-4 text-ink/85">
        <h2 className="text-2xl font-semibold">Apa yang kami kerjakan?</h2>
        <p>
          Kami menyediakan layanan kreatif seperti website undangan digital,
          website untuk usaha, dan buket bunga. Katalog dapat berkembang seiring
          kebutuhan pelanggan dan kemampuan tim.
        </p>
        <p>
          Setiap kebutuhan bisa berbeda. Harga yang tercantum di katalog adalah
          harga awal; ruang lingkup dan harga final dibicarakan bersama melalui
          WhatsApp sebelum pekerjaan dimulai.
        </p>
      </section>

      <section className="mt-8 rounded-card border border-deep-green/10 bg-white p-6 shadow-soft">
        <h2 className="text-2xl font-semibold">Cara bekerja</h2>
        <ol className="mt-4 grid gap-4 sm:grid-cols-3">
          {[
            ["1. Pilih", "Temukan layanan yang sesuai di katalog."],
            ["2. Diskusikan", "Ceritakan kebutuhan dan sepakati harga serta ruang lingkup di WhatsApp."],
            ["3. Wujudkan", "Tim yang sesuai mengerjakan pesanan dan membagikan progresnya."],
          ].map(([title, text]) => (
            <li key={title} className="rounded-xl bg-off-white p-4">
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-ink/75">{text}</p>
            </li>
          ))}
        </ol>
      </section>

      <p className="mt-8 text-sm text-ink/70">
        Lihat <Link href="/layanan" className="font-semibold text-deep-green underline">katalog layanan</Link>{" "}
        atau <Link href="/syarat-ketentuan" className="font-semibold text-deep-green underline">syarat dan ketentuan</Link> sebelum memesan.
      </p>
    </main>
  );
}
