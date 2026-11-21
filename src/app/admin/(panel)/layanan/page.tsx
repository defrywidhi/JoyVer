import type { Metadata } from "next";
import Link from "next/link";
import { deleteService } from "@/app/admin/actions";
import { DeleteButton } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin";
import { formatRupiah } from "@/lib/site";

export const metadata: Metadata = { title: "Layanan" };

type Row = {
  id: string;
  name: string;
  price_from: number;
  is_active: boolean;
  category: { name: string } | null;
};

export default async function ServicesAdminPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("services")
    .select("id, name, price_from, is_active, category:categories(name)")
    .order("sort_order");
  const rows = (data ?? []) as unknown as Row[];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-3xl font-semibold">Layanan</h1>
        <Link
          href="/admin/layanan/baru"
          className="rounded-pill bg-golden-yellow px-5 py-2 text-sm font-semibold text-deep-green hover:bg-golden-dark"
        >
          + Layanan baru
        </Link>
      </div>


      <div className="overflow-hidden rounded-card border border-deep-green/10 bg-white">
        {rows.length === 0 ? (
          <p className="p-6 text-sm text-ink/70">Belum ada layanan.</p>
        ) : (
          <ul className="divide-y divide-deep-green/10">
            {rows.map((s) => (
              <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
                <div>
                  <p className="font-semibold">
                    {s.name}
                    {!s.is_active && (
                      <span className="ml-2 rounded-pill bg-deep-green/10 px-2 py-0.5 text-xs">
                        Nonaktif
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-ink/60">
                    {s.category?.name} &middot; mulai dari {formatRupiah(s.price_from)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/layanan/${s.id}`}
                    className="rounded-pill border border-deep-green/30 px-3 py-1 text-xs font-semibold text-deep-green hover:bg-clover-soft"
                  >
                    Ubah
                  </Link>
                  <DeleteButton action={deleteService} fields={{ id: s.id }} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
