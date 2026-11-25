import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function CloverIcon({ className = "size-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <g fill="currentColor">
        <circle cx="12" cy="11" r="6" />
        <circle cx="20" cy="11" r="6" />
        <circle cx="12" cy="19" r="6" />
        <circle cx="20" cy="19" r="6" />
      </g>
      <path
        d="M16 17c0 5 1 9 4 13"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

/** Logo resmi (public/logo.png). Ikon persegi tanpa teks, jadi nama dipasang terpisah. */
export function LogoMark({
  size = 40,
  priority = false,
  className = "",
}: {
  size?: number;
  priority?: boolean;
  className?: string;
}) {
  return (
    <Image
      src="/logo.png"
      alt=""
      width={size}
      height={size}
      priority={priority}
      className={`shrink-0 rounded-[22%] object-cover ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link
      href="/"
      aria-label={`${siteConfig.name}, ke beranda`}
      className={`flex items-center gap-2.5 font-heading text-2xl font-semibold ${
        light ? "text-off-white" : "text-deep-green"
      }`}
    >
      <LogoMark size={40} priority className={light ? "ring-1 ring-white/25" : ""} />
      {siteConfig.name}
    </Link>
  );
}
