import type { Metadata } from "next";
import Link from "next/link";
import { deleteTeamMember } from "@/app/adalahpokoknya/actions";
import { DeleteButton } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin";

export const metadata: Metadata = { title: "Tim" };

type Row = {
  id: string;
  name: string;
  role_title: string | null;
  skills: string[];
  is_active: boolean;
};

export default async function TeamAdminPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("team_members")
    .select("id, name, role_title, skills, is_active")
    .order("sort_order");
  const rows = (data ?? []) as Row[];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-3xl font-semibold">Tim</h1>
        <Link
          href="/adalahpokoknya/tim/baru"
          className="rounded-pill bg-golden-yellow px-5 py-2 text-sm font-semibold text-deep-green hover:bg-golden-dark"
        >
          + Anggota baru
        </Link>
      </div>

      <div className="overflow-hidden rounded-card border border-deep-green/10 bg-white">
        {rows.length === 0 ? (
          <p className="p-6 text-sm text-ink/70">Belum ada anggota tim.</p>
        ) : (
          <ul className="divide-y divide-deep-green/10">
            {rows.map((m) => (
              <li key={m.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
                <div>
                  <p className="font-semibold">
                    {m.name}
                    {!m.is_active && (
                      <span className="ml-2 rounded-pill bg-deep-green/10 px-2 py-0.5 text-xs">
                        Nonaktif
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-ink/60">
                    {[m.role_title, m.skills.join(", ")].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/adalahpokoknya/tim/${m.id}`}
                    className="rounded-pill border border-deep-green/30 px-3 py-1 text-xs font-semibold text-deep-green hover:bg-clover-soft"
                  >
                    Ubah
                  </Link>
                  <DeleteButton
                    action={deleteTeamMember}
                    fields={{ id: m.id }}
                    confirmText={`Hapus ${m.name}? Order yang ditugaskan padanya menjadi belum ditugaskan.`}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
