---
name: cal-clinic-setup
description: Use when setting up or checking Cal.com booking for a new dental clinic client, or when mapping Cal.com event links into site.config.ts.
---

Manual setup in the Cal.com dashboard (the agent cannot do these):
1. Create the clinic's Cal.com account (or Teams account if multiple dentists).
2. Connect the clinic's calendar so existing appointments block slots.
3. Create one event type per service in site.config.ts (checkup, implants, whitening, braces, emergency, etc.) with the right duration.
4. Set working hours, buffer time between appointments, and minimum notice.
5. Keep booking questions minimal: name, phone, email, optional short reason. No medical history or insurance member IDs.
6. Check that confirmation emails, cancel links, and reschedule links work with a real test booking.
7. If the plan allows, set reminders; if multiple dentists, configure round-robin (Teams plan).
8. Copy each event link into site.config.ts under booking.eventTypes.
9. Test the booking on a phone from the live website.