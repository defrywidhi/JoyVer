import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CloverIcon } from "@/components/Logo";
import { OrderForm } from "@/components/OrderForm";
import { getServiceBySlug } from "@/lib/data";
import { formatRupiah } from "@/lib/site";

// Segment config harus literal; samakan dengan PUBLIC_REVALIDATE_SECONDS di lib/cache.ts.
export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

// Tanpa pra-render saat build; tiap halaman layanan dibuat saat pertama dibuka lalu di-cache (ISR).
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return { title: "Layanan tidak ditemukan" };
  return {
    title: service.name,
    description: service.short_description ?? service.description ?? undefined,
    alternates: { canonical: `/layanan/${service.slug}` },
    openGraph: {
      type: "website",
      title: service.name,
      description: service.short_description ?? service.description ?? undefined,
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: `${service.name} | JoyVer` }],
    },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <Link href="/layanan" className="text-sm font-semibold text-deep-green underline underline-offset-4">
        &larr; Semua layanan
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-card bg-clover-soft shadow-soft">
            {service.image_url ? (
              <Image
                src={service.image_url}
                alt={service.name}
                fill
                priority
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center text-clover-green/40">
                <CloverIcon className="size-28" />
              </div>
            )}
          </div>

          {service.category && (
            <span className="mt-6 inline-block rounded-pill bg-clover-soft px-3 py-1 text-xs font-semibold text-deep-green">
              {service.category.name}
            </span>
          )}
          <h1 className="mt-2 text-4xl font-semibold">{service.name}</h1>
          <p className="mt-3 text-ink/70">
            Mulai dari{" "}
            <span className="text-3xl font-bold text-deep-green">
              {formatRupiah(service.price_from)}
            </span>
          </p>
          <div className="mt-6 space-y-3 whitespace-pre-line text-ink/85">
            {service.description ?? service.short_description}
          </div>
        </div>

        <aside className="h-fit rounded-card border border-deep-green/10 bg-white p-6 shadow-soft lg:sticky lg:top-24">
          <h2 className="mb-1 text-2xl font-semibold">Pesan layanan ini</h2>
          <p className="mb-5 text-sm text-ink/70">
            Isi data singkat, lalu lanjut diskusi di WhatsApp.
          </p>
          <OrderForm serviceId={service.id} serviceName={service.name} />
        </aside>
      </div>
    </main>
  );
}
