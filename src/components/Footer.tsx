import Link from "next/link";
import { navLinks, siteConfig } from "@/lib/site";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-24 bg-deep-green text-off-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-3">
        <div>
          <Logo light />
          <p className="mt-3 font-heading text-lg text-golden-yellow">
            {siteConfig.tagline}
          </p>
          <p className="mt-2 max-w-xs text-sm text-off-white/80">
            {siteConfig.values}
          </p>
        </div>

        <nav aria-label="Footer">
          <h2 className="mb-3 font-sans text-sm font-semibold tracking-widest text-golden-yellow uppercase">
            Jelajahi
          </h2>
          <ul className="space-y-2 text-sm">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-off-white/80 hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="mb-3 font-sans text-sm font-semibold tracking-widest text-golden-yellow uppercase">
            Cara Pesan
          </h2>
          <p className="text-sm text-off-white/80">
            Pilih layanan, isi form singkat, lalu kita lanjut ngobrol di WhatsApp
            sampai deal.
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-off-white/70">
        &copy; {new Date().getFullYear()} {siteConfig.name}. Dibuat dengan sepenuh hati.
      </div>
    </footer>
  );
}
