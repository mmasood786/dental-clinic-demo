import Link from "next/link";

import { ArrowRightIcon } from "@/components/icons";
import { Container } from "@/components/layout/container";
import { TeamCard } from "@/components/sections/team-card";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { siteConfig } from "@/config/site.config";

export function TeamSection() {
  const team = siteConfig.about.team;

  if (team.length === 0) {
    return null;
  }

  return (
    <Section tone="surface" aria-labelledby="team-heading">
      <Container>
        <ScrollReveal>
          <SectionHeading
            id="team-heading"
            eyebrow="The team"
            title="The people you will actually meet"
            intro={siteConfig.about.intro}
            action={
              <Link
                href="/about"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-dark transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                More about the practice
                <ArrowRightIcon className="size-4" />
              </Link>
            }
          />
        </ScrollReveal>

        <ul className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((member, index) => (
            <li key={member.name} className="h-full">
              <ScrollReveal delay={Math.min(index, 3) * 80} className="h-full">
                <TeamCard member={member} />
              </ScrollReveal>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
