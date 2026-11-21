import type { Metadata } from "next";
import { CloverIcon } from "@/components/Logo";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Masuk Admin",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-12">
      <div className="w-full max-w-sm rounded-card border border-deep-green/10 bg-white p-8 shadow-soft">
        <div className="mb-6 flex flex-col items-center text-center">
          <CloverIcon className="size-12 text-clover-green" />
          <h1 className="mt-2 text-3xl font-semibold">JoyVer Admin</h1>
          <p className="text-sm text-ink/70">Masuk untuk mengelola website.</p>
        </div>
        {error === "forbidden" && (
          <p role="alert" className="mb-4 rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700">
            Akun ini bukan admin.
          </p>
        )}
        <LoginForm />
      </div>
    </main>
  );
}
