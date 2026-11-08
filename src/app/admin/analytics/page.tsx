import type { Metadata } from "next";
import type { ReactNode } from "react";
import { count, desc, gte, sql } from "drizzle-orm";

import { Container } from "@/components/layout/container";
import { siteConfig } from "@/config/site.config";
import { getDb } from "@/db";
import { contactEvents } from "@/db/schema";
import { addDaysToIsoDate, todayInTimeZone } from "@/lib/dates";
import { TRACK_EVENTS, type TrackEventName } from "@/lib/track";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact analytics",
  robots: { index: false, follow: false },
};

const DAYS = 30;

const EVENT_LABELS: Record<TrackEventName, string> = {
  click_call: "Phone clicks",
  click_whatsapp: "WhatsApp clicks",
  click_directions: "Directions clicks",
  start_booking: "Bookings started",
  complete_booking: "Bookings completed",
  submit_contact_form: "Contact forms sent",
};

type DayRow = { day: string; total: number };

export default async function AdminAnalyticsPage() {
  const db = getDb();

  if (!db) {
    return (
      <AdminShell>
        <Notice
          title="Database not configured"
          body="Set DATABASE_URL to store contact events and see analytics here. The marketing site keeps working without it."
        />
      </AdminShell>
    );
  }

  const timeZone = siteConfig.timeZone;
  const today = todayInTimeZone(timeZone);
  const startDay = addDaysToIsoDate(today, -(DAYS - 1));
  const since = sql`${startDay}::date AT TIME ZONE ${timeZone}`;

  const dayBucket = sql<string>`to_char(${contactEvents.occurredAt} AT TIME ZONE ${timeZone}, 'YYYY-MM-DD')`;

  try {
    const [eventRows, dayRows] = await Promise.all([
      db
        .select({ eventName: contactEvents.eventName, total: count() })
        .from(contactEvents)
        .where(gte(contactEvents.occurredAt, since))
        .groupBy(contactEvents.eventName)
        .orderBy(desc(count())),
      db
        .select({ day: dayBucket, total: count() })
        .from(contactEvents)
        .where(gte(contactEvents.occurredAt, since))
        .groupBy(dayBucket)
        .orderBy(dayBucket),
    ]);

    const byEvent = new Map(
      eventRows.map((row) => [row.eventName, row.total] as const),
    );
    const byDay = new Map(dayRows.map((row) => [row.day, row.total] as const));
    const days: DayRow[] = Array.from({ length: DAYS }, (_, index) => {
      const day = addDaysToIsoDate(startDay, index);

      return { day, total: byDay.get(day) ?? 0 };
    });

    const totalEvents = eventRows.reduce((sum, row) => sum + row.total, 0);
    const maxDay = Math.max(1, ...days.map((row) => row.total));

    return (
      <AdminShell>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          Contact intent recorded by the website over the last {DAYS} days
          ({startDay} to {today}, {timeZone}). Events contain no personal data.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Tracked events" value={totalEvents} />
          <Stat label="Bookings started" value={byEvent.get("start_booking") ?? 0} />
          <Stat
            label="Bookings completed"
            value={byEvent.get("complete_booking") ?? 0}
          />
          <Stat
            label="Contact forms sent"
            value={byEvent.get("submit_contact_form") ?? 0}
          />
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <Panel title="By event type">
            <table className="w-full text-sm">
              <caption className="sr-only">
                Contact events by type over the last {DAYS} days
              </caption>
              <thead>
                <tr className="border-b border-ink/10 text-left text-xs tracking-wide text-muted uppercase">
                  <th scope="col" className="pb-2 font-semibold">
                    Event
                  </th>
                  <th scope="col" className="pb-2 text-right font-semibold">
                    Count
                  </th>
                </tr>
              </thead>
              <tbody>
                {TRACK_EVENTS.map((event) => (
                  <tr key={event} className="border-b border-ink/5 last:border-0">
                    <th scope="row" className="py-2.5 text-left font-medium text-ink">
                      {EVENT_LABELS[event]}
                    </th>
                    <td className="py-2.5 text-right font-semibold tabular-nums text-ink">
                      {byEvent.get(event) ?? 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>

          <Panel title="By day">
            <div className="max-h-[26rem] overflow-y-auto pr-1">
              <table className="w-full text-sm">
                <caption className="sr-only">
                  Contact events per day over the last {DAYS} days
                </caption>
                <thead className="sticky top-0 bg-white">
                  <tr className="border-b border-ink/10 text-left text-xs tracking-wide text-muted uppercase">
                    <th scope="col" className="pb-2 font-semibold">
                      Day
                    </th>
                    <th scope="col" className="pb-2 text-right font-semibold">
                      Events
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[...days].reverse().map((row) => (
                    <tr key={row.day} className="border-b border-ink/5 last:border-0">
                      <th scope="row" className="py-2 text-left font-medium text-ink">
                        {formatDay(row.day)}
                      </th>
                      <td className="py-2 text-right">
                        <span className="flex items-center justify-end gap-2">
                          <span
                            aria-hidden="true"
                            className="h-1.5 rounded-full bg-brand/70"
                            style={{
                              width: `${Math.max(
                                row.total > 0 ? 8 : 0,
                                (row.total / maxDay) * 100,
                              )}%`,
                              maxWidth: "4rem",
                            }}
                          />
                          <span className="w-8 font-semibold tabular-nums text-ink">
                            {row.total}
                          </span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>
      </AdminShell>
    );
  } catch (error) {
    console.error("Admin analytics: query failed.", error);

    return (
      <AdminShell>
        <Notice
          title="Could not load analytics"
          body="The database query failed. Check DATABASE_URL and that the latest migration has been applied (npm run db:migrate). The site itself is unaffected."
        />
      </AdminShell>
    );
  }
}

function AdminShell({ children }: { children: ReactNode }) {
  return (
    <section className="py-12 lg:py-16">
      <Container>
        <p className="text-[11px] font-semibold tracking-[0.18em] text-brand-dark uppercase">
          Staff only
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Contact analytics
        </h1>
        {children}
      </Container>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-5">
      <p className="text-xs font-semibold tracking-wide text-muted uppercase">
        {label}
      </p>
      <p className="mt-2 font-display text-3xl font-semibold tabular-nums text-ink">
        {value}
      </p>
    </div>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-5 sm:p-6">
      <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Notice({ title, body }: { title: string; body: string }) {
  return (
    <div
      role="alert"
      className="mt-6 rounded-2xl border border-accent/40 bg-white p-6"
    >
      <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-ink/75">{body}</p>
    </div>
  );
}

/** "Tue 4 Nov 2026" for a clinic-local calendar date. */
function formatDay(day: string): string {
  const [year, month, date] = day.split("-").map(Number);

  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, date)));
}
