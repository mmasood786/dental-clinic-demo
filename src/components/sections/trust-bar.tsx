import { Container } from "@/components/layout/container";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Section } from "@/components/ui/section";
import { siteConfig, type TrustPoint } from "@/config/site.config";

/**
 * Which facts to show first when more than four are available. Anything else
 * in `trustPoints` still appears afterwards, so a clinic can add its own.
 */
const featuredOrder: Array<NonNullable<TrustPoint["key"]>> = [
  "rating",
  "experience",
  "patients",
  "insurance",
  "emergency",
];

export function TrustBar() {
  const insuranceCount = siteConfig.insurancePartners.filter(
    (partner) => !partner.selfPay,
  ).length;

  const pool: TrustPoint[] = [...siteConfig.trustPoints];

  if (insuranceCount > 0) {
    pool.push({
      key: "insurance",
      value: `${insuranceCount} plans`,
      label: "Insurance accepted",
    });
  }

  const featured = featuredOrder.flatMap((key) =>
    pool.filter((point) => point.key === key),
  );
  const remaining = pool.filter(
    (point) => !point.key || !featuredOrder.includes(point.key),
  );
  const facts = [...featured, ...remaining].slice(0, 4);

  if (facts.length === 0) {
    return null;
  }

  return (
    <Section spacing="sm" className="border-b border-ink/10 bg-white">
      <Container>
        <h2 className="sr-only">Why patients choose {siteConfig.shortName}</h2>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4 sm:gap-0 sm:divide-x sm:divide-ink/10">
          {facts.map((fact, index) => (
            <ScrollReveal key={fact.label} delay={index * 70}>
              <div className="flex h-full flex-col-reverse sm:px-6">
                <dt className="mt-1.5 text-xs leading-snug text-muted">
                  {fact.label}
                </dt>
                <dd className="font-display text-2xl font-semibold tracking-tight text-brand-dark sm:text-3xl">
                  {fact.value}
                </dd>
              </div>
            </ScrollReveal>
          ))}
        </dl>
      </Container>
    </Section>
  );
}
