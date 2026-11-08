import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

/**
 * Privacy-light interaction log: which contact channel was clicked, which page
 * it happened on, and the campaign that brought the visitor there. No personal
 * data, no cookies, no IP addresses.
 *
 * Bookings themselves live in Cal.com, not here.
 */
export const contactEvents = pgTable(
  "contact_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    eventName: text("event_name").notNull(),
    pagePath: text("page_path").notNull(),
    utmSource: text("utm_source"),
    utmMedium: text("utm_medium"),
    utmCampaign: text("utm_campaign"),
    utmTerm: text("utm_term"),
    utmContent: text("utm_content"),
    serviceSlug: text("service_slug"),
    locationSlug: text("location_slug"),
    placement: text("placement"),
    /** Timestamp sent by the browser; `createdAt` is the server's receipt time. */
    occurredAt: timestamp("occurred_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("contact_events_created_at_idx").on(table.createdAt),
    index("contact_events_event_name_idx").on(table.eventName),
  ],
);

export type ContactEventRow = typeof contactEvents.$inferSelect;
export type NewContactEvent = typeof contactEvents.$inferInsert;
