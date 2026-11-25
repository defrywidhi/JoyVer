"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/adalahpokoknya", label: "Ringkasan" },
  { href: "/adalahpokoknya/orders", label: "Order" },
  { href: "/adalahpokoknya/layanan", label: "Layanan" },
  { href: "/adalahpokoknya/kategori", label: "Kategori" },
  { href: "/adalahpokoknya/tim", label: "Tim" },
  { href: "/adalahpokoknya/testimoni", label: "Testimoni" },
  { href: "/adalahpokoknya/pengaturan", label: "Pengaturan" },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin" className="flex gap-1 overflow-x-auto md:flex-col">
      {items.map((i) => {
        const active =
          i.href === "/adalahpokoknya" ? pathname === "/adalahpokoknya" : pathname.startsWith(i.href);
        return (
          <Link
            key={i.href}
            href={i.href}
            aria-current={active ? "page" : undefined}
            className={`shrink-0 rounded-xl px-4 py-2 text-sm font-semibold transition ${
              active
                ? "bg-deep-green text-off-white"
                : "text-deep-green hover:bg-clover-soft"
            }`}
          >
            {i.label}
          </Link>
        );
      })}
    </nav>
  );
}
