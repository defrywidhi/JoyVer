import { siteConfig } from "@/lib/site";

const swatches = [
  { name: "Deep Green", className: "bg-deep-green text-off-white" },
  { name: "Clover Green", className: "bg-clover-green text-white" },
  { name: "Golden Yellow", className: "bg-golden-yellow text-deep-green" },
  { name: "Off White", className: "bg-off-white text-deep-green border border-deep-green/20" },
];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-8 px-6 py-16">
      <div>
        <p className="mb-2 text-sm font-semibold tracking-widest text-clover-green uppercase">
          Proyek sedang dibangun
        </p>
        <h1 className="text-5xl font-semibold">{siteConfig.name}</h1>
        <p className="mt-2 font-heading text-2xl text-deep-green/80">
          {siteConfig.tagline}
        </p>
        <p className="mt-4 max-w-xl text-lg">{siteConfig.description}</p>
      </div>

      <a
        href="#"
        className="w-fit rounded-pill bg-golden-yellow px-6 py-3 font-semibold text-deep-green shadow-soft transition hover:-translate-y-0.5 hover:bg-golden-dark"
      >
        Pesan via WhatsApp
      </a>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {swatches.map((s) => (
          <div
            key={s.name}
            className={`rounded-card p-4 text-sm font-medium shadow-soft ${s.className}`}
          >
            {s.name}
          </div>
        ))}
      </div>
    </main>
  );
}
