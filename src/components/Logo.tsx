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

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link
      href="/"
      className={`flex items-center gap-2 font-heading text-2xl font-semibold ${
        light ? "text-off-white" : "text-deep-green"
      }`}
    >
      <CloverIcon className="size-8 text-clover-green" />
      {siteConfig.name}
    </Link>
  );
}
