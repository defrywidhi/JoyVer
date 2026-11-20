import Link from "next/link";
import { CloverIcon } from "@/components/Logo";
import { ServiceCard } from "@/components/ServiceCard";
import { Stars } from "@/components/Stars";
import {
  getAdminWa,
  getApprovedTestimonials,
  getCategories,
  getServices,
} from "@/lib/data";
import { buildWhatsAppUrl, siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

const steps = [
  { title: "Pilih layanan", text: "Lihat katalog dan pilih yang sesuai kebutuhan." },
  { title: "Isi form singkat", text: "Nama, nomor WhatsApp, dan gambaran kebutuhan Anda." },
  { title: "Ngobrol di WhatsApp", text: "Diskusi detail dan harga sampai sama-sama deal." },
];

export default async function Home() {
  const [categories, services, testimonials, adminWa] = await Promise.all([
    getCategories(),
    getServices(),
    getApprovedTestimonials(),
    getAdminWa(),
  ]);

  const waUrl = buildWhatsAppUrl(adminWa, "Halo JoyVer, saya ingin bertanya tentang layanan.");

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <CloverIcon className="pointer-events-none absolute -top-10 -right-10 size-72 text-clover-green/10" />
        <CloverIcon className="pointer-events-none absolute bottom-0 -left-12 size-48 text-golden-yellow/20" />
        <div className="relative mx-auto max-w-6xl px-5 py-20 md:py-28">
          <p className="mb-3 text-sm font-semibold tracking-widest text-clover-green uppercase">
            {siteConfig.tagline}
          </p>
          <h1 className="max-w-2xl text-4xl leading-tight font-semibold md:text-6xl">
            Hadirkan kebahagiaan di setiap momen Anda
          </h1>
          <p className="mt-5 max-w-xl text-lg text-ink/80">{siteConfig.description}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/layanan"
              className="rounded-pill bg-golden-yellow px-7 py-3.5 font-semibold text-deep-green shadow-soft transition hover:-translate-y-0.5 hover:bg-golden-dark"
            >
              Lihat Layanan
            </Link>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-pill border-2 border-deep-green px-7 py-3 font-semibold text-deep-green transition hover:bg-deep-green hover:text-off-white"
            >
              Tanya via WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Kategori */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 py-12">
          <h2 className="mb-6 text-3xl font-semibold">Kami bisa bantu apa?</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/layanan?kategori=${c.slug}`}
                className="group rounded-card border border-deep-green/10 bg-clover-soft p-6 transition hover:-translate-y-1 hover:shadow-soft"
              >
                <CloverIcon className="mb-3 size-9 text-clover-green" />
                <h3 className="text-xl font-semibold">{c.name}</h3>
                {c.description && (
                  <p className="mt-1 text-sm text-ink/75">{c.description}</p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Layanan unggulan */}
      {services.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 py-12">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 className="text-3xl font-semibold">Layanan populer</h2>
            <Link href="/layanan" className="text-sm font-semibold text-deep-green underline underline-offset-4">
              Semua layanan
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 6).map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
        </section>
      )}

      {/* Cara pesan */}
      <section className="mx-auto max-w-6xl px-5 py-12">
        <h2 className="mb-6 text-3xl font-semibold">Cara pesan, mudah banget</h2>
        <ol className="grid gap-4 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className="rounded-card border border-deep-green/10 bg-white p-6 shadow-soft">
              <span className="mb-3 flex size-10 items-center justify-center rounded-full bg-deep-green font-heading text-lg font-semibold text-golden-yellow">
                {i + 1}
              </span>
              <h3 className="text-lg font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-ink/75">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Testimoni */}
      {testimonials.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 py-12">
          <h2 className="mb-6 text-3xl font-semibold">Kata mereka</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {testimonials.slice(0, 3).map((t) => (
              <figure key={t.id} className="rounded-card border border-deep-green/10 bg-white p-6 shadow-soft">
                <Stars rating={t.rating} />
                <blockquote className="mt-3 text-sm text-ink/85">&ldquo;{t.message}&rdquo;</blockquote>
                <figcaption className="mt-4 text-sm font-semibold text-deep-green">{t.name}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-5 py-12">
        <div className="rounded-card bg-deep-green px-6 py-12 text-center text-off-white md:px-12">
          <h2 className="!text-off-white text-3xl font-semibold">Siap mulai bareng JoyVer?</h2>
          <p className="mx-auto mt-3 max-w-lg text-off-white/80">{siteConfig.values}</p>
          <Link
            href="/layanan"
            className="mt-6 inline-block rounded-pill bg-golden-yellow px-7 py-3.5 font-semibold text-deep-green transition hover:-translate-y-0.5 hover:bg-golden-dark"
          >
            Pilih Layanan
          </Link>
        </div>
      </section>
    </main>
  );
}
