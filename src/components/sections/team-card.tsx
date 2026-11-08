import Image from "next/image";

import { ToothIcon } from "@/components/icons";
import type { AboutContent } from "@/config/site.config";

type TeamMember = AboutContent["team"][number];

function initials(name: string): string {
  return name
    .replace(/^Dr\.\s+/, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("");
}

/**
 * One member of the clinical or front-of-house team.
 *
 * Team photos are optional in the config; when a member has no photo the card
 * shows a soft initials placeholder rather than a stock face.
 */
export function TeamCard({ member }: { member: TeamMember }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-card transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-brand/25 hover:shadow-card-hover motion-reduce:transform-none motion-reduce:transition-none">
      <div className="relative aspect-[4/3] overflow-hidden bg-linear-to-br from-brand-light via-white to-accent-soft">
        {member.photo ? (
          <Image
            src={member.photo.src}
            alt={member.photo.alt}
            fill
            sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 100vw"
            className="object-cover"
            loading="lazy"
          />
        ) : (
          <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
            <ToothIcon className="absolute -right-6 -bottom-8 size-40 text-brand/10" />
            <span className="absolute inset-0 grid place-items-center">
              <span className="grid size-20 place-items-center rounded-full bg-white/80 font-display text-2xl font-semibold text-brand-dark shadow-card">
                {initials(member.name)}
              </span>
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-lg font-semibold text-ink">
          {member.name}
        </h3>
        <p className="mt-1 text-eyebrow font-semibold text-brand-dark uppercase">
          {member.role}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted">{member.bio}</p>
      </div>
    </article>
  );
}
