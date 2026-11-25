import Link from "next/link";
import { navLinks } from "@/lib/site";
import { Logo } from "./Logo";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-deep-green/10 bg-off-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Utama">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-pill px-4 py-2 text-sm font-medium text-deep-green transition hover:bg-clover-soft"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <details className="group relative md:hidden">
          <summary
            className="flex size-10 cursor-pointer list-none items-center justify-center rounded-full text-deep-green hover:bg-clover-soft [&::-webkit-details-marker]:hidden"
            aria-label="Buka menu"
          >
            <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </summary>
          <nav
            className="absolute right-0 mt-2 w-56 rounded-card border border-deep-green/10 bg-off-white p-2 shadow-soft"
            aria-label="Menu seluler"
          >
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="block rounded-xl px-4 py-3 text-sm font-medium text-deep-green hover:bg-clover-soft"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </details>
      </div>
    </header>
  );
}
