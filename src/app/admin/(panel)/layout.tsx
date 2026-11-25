import type { Metadata } from "next";
import Link from "next/link";
import { logout } from "@/app/admin/actions";
import { AdminNav } from "@/components/admin/AdminNav";
import { ActionButton } from "@/components/admin/ui";
import { Logo } from "@/components/Logo";
import { requireAdmin } from "@/lib/admin";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Admin JoyVer" },
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export const dynamic = "force-dynamic";

export default async function PanelLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { user } = await requireAdmin();

  return (
    <div className="mx-auto min-h-screen max-w-7xl px-4 py-5">
      <header className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-deep-green/10 pb-4">
        <Logo />
        <div className="flex items-center gap-3 text-sm">
          <Link href="/" target="_blank" className="font-semibold text-deep-green underline underline-offset-4">
            Lihat situs
          </Link>
          <span className="hidden text-ink/60 sm:inline">{user.email}</span>
          <ActionButton
            action={logout}
            label="Keluar"
            pendingLabel="Keluar..."
            variant="outline"
            confirm={{
              title: "Keluar dari admin?",
              message: "Anda perlu masuk lagi untuk mengelola website.",
              confirmLabel: "Ya, keluar",
            }}
          />
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-[13rem_1fr]">
        <AdminNav />
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
