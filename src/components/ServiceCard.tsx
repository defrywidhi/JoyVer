import Image from "next/image";
import Link from "next/link";
import { formatRupiah } from "@/lib/site";
import type { Service } from "@/lib/types";
import { CloverIcon } from "./Logo";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <Link
      href={`/layanan/${service.slug}`}
      className="group flex flex-col overflow-hidden rounded-card border border-deep-green/10 bg-white shadow-soft transition hover:-translate-y-1"
    >
      <div className="relative aspect-[4/3] bg-clover-soft">
        {service.image_url ? (
          <Image
            src={service.image_url}
            alt={service.name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-clover-green/40">
            <CloverIcon className="size-20" />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        {service.category && (
          <span className="w-fit rounded-pill bg-clover-soft px-3 py-1 text-xs font-semibold text-deep-green">
            {service.category.name}
          </span>
        )}
        <h3 className="text-xl font-semibold">{service.name}</h3>
        {service.short_description && (
          <p className="text-sm text-ink/80">{service.short_description}</p>
        )}
        <p className="mt-auto pt-3 text-sm text-ink/70">
          Mulai dari{" "}
          <span className="text-lg font-bold text-deep-green">
            {formatRupiah(service.price_from)}
          </span>
        </p>
      </div>
    </Link>
  );
}
