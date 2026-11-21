"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/admin", label: "Ringkasan" },
  { href: "/admin/orders", label: "Order" },
  { href: "/admin/layanan", label: "Layanan" },
  { href: "/admin/kategori", label: "Kategori" },
  { href: "/admin/tim", label: "Tim" },
  { href: "/admin/testimoni", label: "Testimoni" },
  { href: "/admin/pengaturan", label: "Pengaturan" },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin" className="flex gap-1 overflow-x-auto md:flex-col">
      {items.map((i) => {
        const active =
          i.href === "/admin" ? pathname === "/admin" : pathname.startsWith(i.href);
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
