import type { Metadata } from "next";
import Link from "next/link";
import { ServiceCard } from "@/components/ServiceCard";
import { getCategories, getServices } from "@/lib/data";

export const metadata: Metadata = {
  title: "Layanan",
  description: "Katalog layanan JoyVer: undangan digital, website usaha, dan buket bunga.",
};

export const dynamic = "force-dynamic";

export default async function LayananPage({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string }>;
}) {
  const { kategori } = await searchParams;
  const [categories, services] = await Promise.all([
    getCategories(),
    getServices(kategori),
  ]);

  const chip = (active: boolean) =>
    `rounded-pill px-4 py-2 text-sm font-semibold transition ${
      active
        ? "bg-deep-green text-off-white"
        : "bg-clover-soft text-deep-green hover:bg-clover-green/20"
    }`;

  return (
    <main className="mx-auto max-w-6xl px-5 py-12">
      <h1 className="text-4xl font-semibold">Layanan Kami</h1>
      <p className="mt-2 max-w-xl text-ink/75">
        Harga di bawah adalah harga awal. Harga final disepakati lewat WhatsApp
        sesuai kebutuhan Anda.
      </p>

      <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filter kategori">
        <Link href="/layanan" className={chip(!kategori)}>
          Semua
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/layanan?kategori=${c.slug}`}
            className={chip(kategori === c.slug)}
          >
            {c.name}
          </Link>
        ))}
      </div>

      {services.length === 0 ? (
        <p className="mt-12 rounded-card bg-clover-soft p-8 text-center text-ink/75">
          Belum ada layanan di kategori ini.
        </p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <ServiceCard key={s.id} service={s} />
          ))}
        </div>
      )}
    </main>
  );
}
