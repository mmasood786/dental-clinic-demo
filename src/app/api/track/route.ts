import { NextResponse } from "next/server";

import { contactEvents } from "@/db/schema";
import { getDb } from "@/db";
import { trackSchema } from "@/lib/validation/track";

export const runtime = "nodejs";

/**
 * Privacy-light analytics sink for `src/lib/track.ts`.
 *
 * Called with `navigator.sendBeacon`, so it always answers quickly with `202`
 * and never throws at the browser: tracking must not affect a booking or an
 * enquiry. Events are still accepted when the database is not configured.
 */
export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const result = trackSchema.safeParse(payload);

  if (!result.success) {
    return NextResponse.json(
      { error: "Invalid tracking payload." },
      { status: 422 },
    );
  }

  const data = result.data;
  const db = getDb();

  if (!db) {
    // Expected before the Neon database is provisioned; keep the page working.
    console.warn("Track: DATABASE_URL is not set; event not stored.");
    return NextResponse.json({ ok: true, stored: false }, { status: 202 });
  }

  const occurredAt = data.timestamp ? new Date(data.timestamp) : new Date();

  try {
    await db.insert(contactEvents).values({
      eventName: data.event,
      pagePath: data.path,
      utmSource: data.utm?.source ?? null,
      utmMedium: data.utm?.medium ?? null,
      utmCampaign: data.utm?.campaign ?? null,
      utmTerm: data.utm?.term ?? null,
      utmContent: data.utm?.content ?? null,
      serviceSlug: data.service ?? null,
      locationSlug: data.location ?? null,
      placement: data.placement ?? null,
      occurredAt,
    });

    return NextResponse.json({ ok: true, stored: true }, { status: 202 });
  } catch (error) {
    console.error("Track: failed to store event.", error);
    return NextResponse.json({ ok: true, stored: false }, { status: 202 });
  }
}
