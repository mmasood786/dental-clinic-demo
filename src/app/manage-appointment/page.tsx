import type { Metadata } from "next";
import Link from "next/link";

import {
  TrackedCallLink,
  TrackedWhatsAppLink,
} from "@/components/analytics/tracked-links";
import {
  CalendarIcon,
  CheckIcon,
  MailIcon,
  PhoneIcon,
  WhatsAppIcon,
} from "@/components/icons";
import { Container } from "@/components/layout/container";
import { JsonLd } from "@/components/seo/json-ld";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { siteConfig } from "@/config/site.config";
import { pageMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";

const PATH = "/manage-appointment";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    title: "Manage your appointment",
    description: `Reschedule or cancel your appointment at ${siteConfig.name} using the links in your confirmation email, or call the studio on ${siteConfig.phone} and we will help.`,
    path: PATH,
  });
}

const crumbs = [
  { label: "Home", href: "/" },
  { label: "Manage your appointment" },
];

const steps = [
  {
    icon: MailIcon,
    title: "Open your confirmation email",
    body: `When your booking is confirmed, Cal.com emails the address you used. Search your inbox for ${siteConfig.name} if you can't see it, and check your spam or promotions folder.`,
  },
  {
    icon: CalendarIcon,
    title: "Choose Reschedule or Cancel",
    body: "At the bottom of that email, use the Reschedule link to pick a new time or the Cancel link to release your slot. No account or password needed.",
  },
  {
    icon: CheckIcon,
    title: "Check the updated confirmation",
    body: "Your change takes effect straight away. You will get a fresh confirmation with the new date and time, plus the same links if you need them again.",
  },
];

export default function ManageAppointmentPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs, PATH)} />

      <PageHero
        eyebrow="Appointments"
        title="Manage your appointment"
        intro="Need a different time, or can't make it after all? You can reschedule or cancel yourself in a few clicks — no need to call."
        breadcrumbs={crumbs}
      />

      <section className="py-14 lg:py-16">
        <Container>
          <SectionHeading
            eyebrow="Three quick steps"
            title="Use the links in your confirmation email"
            intro="Every Cal.com confirmation includes a Reschedule link and a Cancel link for that booking. They are the fastest way to change your visit."
          />

          <ol className="mt-8 grid gap-4 lg:grid-cols-3">
            {steps.map(({ icon: Icon, title, body }, index) => (
              <li
                key={title}
                className="relative flex gap-4 rounded-2xl border border-ink/10 bg-white p-5 sm:p-6"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-light text-brand">
                  <Icon className="size-5" />
                </span>
                <div>
                  <p className="text-[11px] font-semibold tracking-[0.18em] text-brand-dark uppercase">
                    Step {index + 1}
                  </p>
                  <h2 className="mt-1 font-display text-lg font-semibold text-ink">
                    {title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="bg-surface py-14 lg:py-16">
        <Container>
          <div className="grid gap-8 rounded-3xl border border-ink/10 bg-white p-6 sm:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:p-10">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.18em] text-brand-dark uppercase">
                Need a hand?
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                Can&apos;t find the email?
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
                Call or message the studio and we will move or cancel your
                appointment for you. Please have your name and the date of your
                visit ready so we can find the booking quickly.
              </p>
              <p className="mt-4 text-sm text-muted">
                Starting fresh?{" "}
                <Link
                  href="/book"
                  className="font-semibold text-brand-dark underline underline-offset-2 hover:text-brand"
                >
                  Book a new appointment
                </Link>
                .
              </p>
            </div>

            <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
              <TrackedCallLink
                variant="primary"
                size="lg"
                placement="manage-appointment"
                className="w-full"
              >
                <PhoneIcon className="size-4" />
                Call {siteConfig.phone}
              </TrackedCallLink>
              <TrackedWhatsAppLink
                variant="secondary"
                size="lg"
                placement="manage-appointment"
                className="w-full"
              >
                <WhatsAppIcon className="size-4 text-[#128C4A]" />
                Message on WhatsApp
              </TrackedWhatsAppLink>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-14 lg:py-16">
        <Container>
          <div className="mx-auto max-w-3xl rounded-3xl border border-accent/40 bg-accent/5 p-6 sm:p-8">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
              Cancellation policy
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink/80 sm:text-base">
              {siteConfig.cancellationPolicy}
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
