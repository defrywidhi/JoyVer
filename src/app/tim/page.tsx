import type { Metadata } from "next";
import { TeamCard } from "@/components/TeamCard";
import { getTeam } from "@/lib/data";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Tim",
  description: "Kenalan dengan tim di balik JoyVer.",
};

export const dynamic = "force-dynamic";

export default async function TimPage() {
  const team = await getTeam();

  return (
    <main className="mx-auto max-w-6xl px-5 py-12">
      <h1 className="text-4xl font-semibold">Tim JoyVer</h1>
      <p className="mt-2 max-w-xl text-ink/75">{siteConfig.values}</p>

      {team.length === 0 ? (
        <p className="mt-12 rounded-card bg-clover-soft p-8 text-center text-ink/75">
          Profil tim akan segera hadir.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {team.map((m) => (
            <TeamCard key={m.id} member={m} />
          ))}
        </div>
      )}
    </main>
  );
}
