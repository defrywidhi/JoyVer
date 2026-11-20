import Image from "next/image";
import type { TeamMember } from "@/lib/types";
import { CloverIcon } from "./Logo";

export function TeamCard({ member }: { member: TeamMember }) {
  return (
    <article className="overflow-hidden rounded-card border border-deep-green/10 bg-white text-center shadow-soft">
      <div className="relative aspect-square bg-clover-soft">
        {member.photo_url ? (
          <Image
            src={member.photo_url}
            alt={`Foto ${member.name}`}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-clover-green/40">
            <CloverIcon className="size-16" />
          </div>
        )}
      </div>
      <div className="space-y-2 p-4">
        <h3 className="text-lg font-semibold">{member.name}</h3>
        {member.role_title && (
          <p className="text-sm text-ink/70">{member.role_title}</p>
        )}
        {member.skills.length > 0 && (
          <ul className="flex flex-wrap justify-center gap-1.5 pt-1">
            {member.skills.map((s) => (
              <li
                key={s}
                className="rounded-pill bg-clover-soft px-2.5 py-0.5 text-xs font-medium text-deep-green"
              >
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
