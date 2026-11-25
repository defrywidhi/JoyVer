"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Category, Service } from "@/lib/types";
import { ServiceCard } from "./ServiceCard";

type Props = { categories: Category[]; services: Service[] };

/** Tampilan katalog. Dipakai juga sebagai fallback Suspense (tanpa filter). */
export function ServiceCatalogView({
  categories,
  services,
  active,
}: Props & { active: string | null }) {
  const filtered = active
    ? services.filter((s) => s.category?.slug === active)
    : services;

  const chip = (isActive: boolean) =>
    `rounded-pill px-4 py-2 text-sm font-semibold transition ${
      isActive
        ? "bg-deep-green text-off-white"
        : "bg-clover-soft text-deep-green hover:bg-clover-green/20"
    }`;

  return (
    <>
      <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filter kategori">
        <Link href="/layanan" scroll={false} className={chip(!active)}>
          Semua
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/layanan?kategori=${c.slug}`}
            scroll={false}
            className={chip(active === c.slug)}
          >
            {c.name}
          </Link>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-12 rounded-card bg-clover-soft p-8 text-center text-ink/75">
          Belum ada layanan di kategori ini.
        </p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <ServiceCard key={s.id} service={s} />
          ))}
        </div>
      )}
    </>
  );
}

/** Filter kategori dilakukan di browser, jadi halaman bisa di-cache statis. */
export function ServiceCatalog(props: Props) {
  const active = useSearchParams().get("kategori");
  return <ServiceCatalogView {...props} active={active} />;
}
