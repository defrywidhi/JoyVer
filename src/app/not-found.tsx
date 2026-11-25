import Link from "next/link";
import { CloverIcon } from "@/components/Logo";

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-xl flex-col items-center px-5 py-24 text-center">
      <CloverIcon className="size-20 text-clover-green/50" />
      <h1 className="mt-4 text-4xl font-semibold">Halaman tidak ditemukan</h1>
      <p className="mt-2 text-ink/75">
        Sepertinya semanggi yang Anda cari belum tumbuh di sini.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-pill bg-golden-yellow px-6 py-3 font-semibold text-deep-green hover:bg-golden-dark"
      >
        Kembali ke Beranda
      </Link>
    </main>
  );
}
