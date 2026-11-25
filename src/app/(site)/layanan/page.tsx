import type { Metadata } from "next";
import { Suspense } from "react";
import { ServiceCatalog, ServiceCatalogView } from "@/components/ServiceCatalog";
import { getCategories, getServices } from "@/lib/data";

export const metadata: Metadata = {
  title: "Layanan",
  description: "Katalog layanan JoyVer: undangan digital, website usaha, dan buket bunga.",
  alternates: { canonical: "/layanan" },
};

// Segment config harus literal; samakan dengan PUBLIC_REVALIDATE_SECONDS di lib/cache.ts.
export const revalidate = 300;

export default async function LayananPage() {
  const [categories, services] = await Promise.all([getCategories(), getServices()]);


  return (
    <main className="mx-auto max-w-6xl px-5 py-12">
      <h1 className="text-4xl font-semibold">Layanan Kami</h1>
      <p className="mt-2 max-w-xl text-ink/75">
        Harga di bawah adalah harga awal. Harga final disepakati lewat WhatsApp
        sesuai kebutuhan Anda.
      </p>

      <Suspense
        fallback={
          <ServiceCatalogView categories={categories} services={services} active={null} />
        }
      >
        <ServiceCatalog categories={categories} services={services} />
      </Suspense>
    </main>
  );
}
