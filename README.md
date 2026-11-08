# Dental clinic website template

A mobile-first marketing site for a dental clinic, built with Next.js 15 (App Router), TypeScript strict mode and Tailwind CSS v4. All clinic-specific content lives in a single config file so the template can be reused for other practices.

## Requirements

- Node.js 20.9 or newer (Next.js 15)
- npm 10+
- A [Cal.com](https://cal.com) account with one event type per treatment
- Optional accounts for full functionality: [Neon](https://neon.tech) (contact-event analytics), [Resend](https://resend.com) (contact form email), Google Cloud (Places API) and Google Analytics 4

## Getting started

```bash
npm install
cp .env.example .env.local   # Windows: copy .env.example .env.local
# fill in the values you need (see the table below)
npm run dev
```

Open http://localhost:3000. The site runs without a database, email key or
Google credentials. Online booking is an embedded Cal.com widget, so it works as
soon as the event links in `src/config/site.config.ts` point at a real Cal.com
account. The contact form returns a JSON `503` until Resend is configured, and
`/admin/analytics` explains that `DATABASE_URL` is missing.

To create the analytics table:

```bash
npm run db:migrate   # needs DATABASE_URL
```

## Environment variables

Copy `.env.example` to `.env.local`. Never commit `.env.local`.

| Variable | Required for | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Production SEO, sitemap, canonical URLs, email links | Full origin, no trailing slash. Falls back to the placeholder clinic URL. |
| `DATABASE_URL` | Contact events, `/admin/analytics` | Neon connection string (use the pooled one for serverless). Optional; without it events are accepted but not stored. |
| `RESEND_API_KEY` | Contact form email | Optional, but `POST /api/contact` returns `503` without it. |
| `EMAIL_FROM` | Outgoing email | Must be a verified sender or domain in Resend. |
| `GOOGLE_PLACES_API_KEY` | Live Google reviews | Optional; the widget falls back to the sample reviews in the config. |
| `NEXT_PUBLIC_GA_ID` | GA4 analytics | Loaded only after cookie consent. Leave empty to disable GA. |
| `ADMIN_PASSWORD` | `/admin/analytics` | HTTP Basic auth password (any username). Unset means the dashboard returns `503` rather than opening. |

Cal.com needs no secret key: the public event links live in the config, and
patients confirm inside Cal.com's own iframe.

## Onboarding a new clinic

All clinic-specific content lives in `src/config/site.config.ts`. Components
read from that file only, so reusing the template is a config change, not a
find-and-replace through JSX.

1. **Identity** — set `name`, `shortName`, `tagline`, `description`, `email`,
   `url`, `phone`, `whatsappNumber`, `whatsappMessage`, `currency` and social
   links.
2. **Location and booking** — update the main `address`, `geo` coordinates,
   `openingHours`, `googlePlaceId` and `timeZone`. In `booking`, set
   `calUsername`, map each service slug to a Cal.com event link in `eventTypes`,
   and choose a `defaultEvent` and `fallbackMessage`.
3. **Studios** — replace the entries in `locations` (slug, area, city,
   structured address, geo, phone, map embed URL, description). Slugs appear in
   URLs, so use lowercase words with hyphens.
4. **Treatments** — replace `services` (slug, title, short description, long
   copy, starting price, duration, FAQs). Every service is combined with every
   studio to generate its "treatment in area" pages.
5. **Pricing and insurance** — update `pricingRows`, `insurancePartners` and the
   disclaimer copy.
6. **Brand** — set the hex values in `brand.colors`; the whole site, Tailwind
   theme, Cal.com embed and social image follow. Check contrast remains AA.
7. **Navigation and copy** — update `nav`, hero, trust bar, about, reviews
   fallback, gallery cases/alt text and the consent note.
8. **Gallery images** — replace the SVGs in `public/gallery/` with real
   before/after photos (with written patient consent) and update the `src` and
   `alt` values in `gallery.cases`.
9. **Cal.com** — create the event types, copy their links into
   `booking.eventTypes`, then test one booking per treatment on a phone.
10. **Environment** — set `NEXT_PUBLIC_SITE_URL`, database, Resend, Places,
    GA4 and admin values in `.env.local` (and in the hosting provider).
11. **Run the checks** — `npm run lint`, `npm test`, `npm run build`, then make
    a test booking and check the confirmation email and cancel/reschedule links.

Placeholder content is fictional ("Lumen Dental Studio"). Replace it before
launch and review [SEO_CHECKLIST.md](./SEO_CHECKLIST.md) for the off-site steps.

## SEO

All technical SEO is generated from the config — there is nothing to edit in the
pages when clinic data changes.

- Every page exports metadata built with `pageMetadata()` from
  `src/lib/seo/metadata.ts`: unique title and description, canonical URL, and
  Open Graph/Twitter tags. Descriptions are clamped to roughly 158 characters.
- `src/lib/seo/schema.ts` builds the JSON-LD: `Dentist` on the home page and
  each studio page (address, geo, opening hours, phone, `sameAs`, `priceRange`),
  `Service` on treatment pages, `FAQPage` where FAQs exist, `WebSite` on the home
  page, and `BreadcrumbList` everywhere. It is rendered by
  `src/components/seo/json-ld.tsx`.
- `src/app/sitemap.ts` lists every indexable route, including all services,
  studios and the combined "treatment in area" pages.
- `src/app/robots.ts` allows the site and blocks `/api/` and `/admin`.
- `src/app/locations/[slug]/[service]/page.tsx` generates the combined landing
  pages (for example `/locations/riverside/implants`). The first segment is the
  studio slug, because both studios share the same city.
- `src/app/opengraph-image.tsx` generates the default 1200×630 social image.

Manual steps (Search Console, Business Profile, citations, validation) are in
[SEO_CHECKLIST.md](./SEO_CHECKLIST.md).

## Theming

`src/app/layout.tsx` injects the brand colors from the config as CSS variables on `<html>`. `src/app/globals.css` maps those variables into Tailwind's `@theme`, which produces the `bg-brand`, `text-ink`, `border-brand-light`, `bg-surface` and related utilities. Change the hex values in the config and the whole site follows.

The Cal.com embed reads the same colors: `src/components/booking/cal-booking.tsx` passes them through `cssVarsPerTheme` (`cal-brand`, `cal-text`, `cal-bg`, …), so the calendar matches the site.

Fonts are loaded with `next/font/google` (Inter for body copy, Fraunces for headings) and exposed as `font-sans` / `font-display`. They are self-hosted, preloaded (the built HTML contains both `<link rel="preload" … as="font">` tags), and use automatic fallback metrics plus `display: "swap"`, so text renders immediately without a visible layout shift.

> Windows note: a Next.js 15.5 webpack bug can leave `next-font-manifest.json` empty when you build on Windows, so a local Windows build may show no preload tags. Linux/CI and Vercel builds emit both tags; the fonts still load on Windows, only the preload hint is missing.

## Rendering, performance and images

- **Static by default.** The home page, marketing pages, service pages, studio
  pages and every "treatment in area" page are prerendered at build time through
  `generateStaticParams()`. Those three dynamic routes also set
  `dynamicParams = false`, so an unknown slug is a real `404` at the routing
  layer rather than an on-demand render that streams a `200` soft-404 status.
  (Next.js logs an internal `NoFallbackError` for such requests; the response is
  still a 404.)
- **Dynamic only where needed.** `/book` reads the `?service=` query string to
  preselect a treatment, and `/admin/analytics` queries the database, so those
  routes are server-rendered on demand. The home page and studio pages use ISR
  (`revalidate = 86400`) to refresh Google reviews daily.
- **Images.** Every image goes through `next/image`, with `fill` + `sizes` inside
  a fixed `aspect-[4/3]` container, so no space is reserved twice. The bundled
  gallery files are SVGs, which the optimizer cannot resize, so they are marked
  `unoptimized`; replace them with JPG/WebP/AVIF photos and they are optimised
  automatically. Images below the fold are lazy-loaded.
- **No layout shift.** Fixed header height, aspect-ratio image frames, a fixed
  map iframe height, a reserved minimum height for the Cal.com embed, and
  `next/font` fallback metrics keep the layout stable. `src/app/loading.tsx`
  shows a skeleton that matches the page structure.
- **Small client surface.** Only the interactive pieces are client components:
  the Cal.com booking widget, contact form, before/after slider, consent
  banner/GA loader, cookie-settings button, tracked links and WhatsApp button.
  Everything else renders on the server.
- **Error handling.** `src/app/error.tsx` is the route error boundary,
  `src/app/not-found.tsx` is the custom 404, and `src/app/loading.tsx` is the
  default loading state. If the Cal.com iframe fails or is still empty after 8
  seconds, `/book` shows phone, WhatsApp and contact-form fallbacks.

## Security headers

`next.config.ts` adds headers to every response:

| Header | Value |
| --- | --- |
| `Content-Security-Policy` | `base-uri 'self'; form-action 'self'; frame-ancestors 'none'; frame-src 'self' https://app.cal.com https://cal.com https://www.google.com https://maps.google.com` |
| `X-Frame-Options` | `DENY` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | camera, microphone, geolocation and payment disabled |
| `Strict-Transport-Security` | two years, `includeSubDomains` |
| `Cross-Origin-Opener-Policy` | `same-origin` |

`poweredByHeader` is disabled. The CSP intentionally omits `default-src` and
`script-src` so GA4, Google Maps, the Cal.com embed script and Next.js bootstrap
scripts keep working; add a nonce-based policy if you need a stricter one.
`frame-src` lists the Cal.com and Google Maps origins that the site embeds. These
headers are served by Next.js itself, so they work on Vercel and on a
self-hosted Node server.

## Structure

```text
src/
  app/                 layout, pages, API routes
  components/
    analytics/         consent banner, GA4 loader, tracked links
    booking/           Cal.com embed, treatment picker, fallback
    forms/             shared form field styles
    layout/            header, footer, mobile action bar, container
    icons.tsx          inline SVG icons (no icon dependency)
  config/site.config.ts  all clinic data
  db/                  Drizzle schema and Neon client (contact events only)
  lib/                 contact links, tracking, dates, formatting, cn helper
drizzle/               generated SQL migrations
```

## Layout features

- Sticky header with logo, desktop nav, click-to-call and a Book Now button
- Footer with opening hours, address, map link, phone, email and social links
- Sticky mobile bar with Call, WhatsApp and Book actions (safe-area aware)
- Skip link, focus styles and AA-contrast color choices

## Pages

| Route | What it does |
| --- | --- |
| `/` | Hero with Book Now and Call, trust bar, services grid, before/after teaser, reviews placeholder, FAQ, final CTA |
| `/services` | All treatments from the config |
| `/services/[slug]` | Treatment detail with description, starting price, price table, FAQ and CTAs, including "Book this treatment" → `/book?service=<slug>` (`generateStaticParams`) |
| `/locations` | Both studios with address, phone and directions |
| `/locations/[slug]` | Studio page with "dentist in {city}" copy, hours, embedded map and directions (`generateStaticParams`) |
| `/locations/[slug]/[service]` | Combined "treatment in area" landing page, e.g. `/locations/riverside/implants` (`generateStaticParams`) |
| `/insurance-pricing` | Accepted insurance plans, pricing table and examination disclaimer |
| `/gallery` | Before/after sliders with captions and a consent note |
| `/about` | Story, values and team from the config |
| `/contact` | Contact form, phone, WhatsApp, email, address and hours |
| `/book` | Treatment picker plus an inline Cal.com calendar; supports `?service=<slug>` deep links |
| `/admin/analytics` | Password-protected contact analytics for staff (not indexed) |

## Online booking (Cal.com)

Bookings are handled entirely by an embedded [Cal.com](https://cal.com) widget.
The website stores no appointments, calculates no availability and talks to no
calendar API. Cal.com owns the slots, calendar sync, confirmation emails and the
cancel/reschedule links.

### Configuration

`src/config/site.config.ts`:

```ts
booking: {
  provider: "cal",
  calUsername: "your-clinic",
  eventTypes: {
    "general-checkup": "your-clinic/general-checkup",
    implants: "your-clinic/implants",
    // …one Cal.com event link per service slug
  },
  defaultEvent: "your-clinic/general-checkup",
  fallbackMessage: "Online booking is taking longer than usual…",
}
```

`eventTypes` is keyed by the same slugs as `services`. A service without an
entry falls back to `defaultEvent`, so a new treatment never produces a dead
button.

### `/book`

- `src/app/book/page.tsx` reads `?service=<slug>` on the server, validates it
  with `getService()` and passes it to `<CalBooking />`.
- The treatment cards are generated from `siteConfig.services`. Selecting one
  renders the inline `@calcom/embed-react` calendar for that event link and
  updates the URL with `history.replaceState`, so the view can be shared.
- The embed is themed with `cal("ui", …)` and the brand colors from the config,
  and is responsive down to 390px.
- A notice above the calendar gives the click-to-call phone number for dental
  emergencies and asks patients not to enter medical details.
- If the iframe reports `linkFailed`, or the embed is still missing after 8
  seconds, the calendar is replaced by the clinic phone, WhatsApp and a link to
  the contact form, plus a retry button. The page is never blank.

### Deep links

Every treatment page has a "Book this treatment" button pointing at
`/book?service=<slug>`; the header, hero, footer and mobile bar all point at
`/book`. `bookingPath()` in `src/lib/paths.ts` builds these URLs.

### Troubleshooting "We couldn't load the online calendar"

The embed needs **no API key or secret**. It only needs public event links.

1. Open `https://cal.com/<value from booking.eventTypes>` in a browser. If it
   returns `404`, the username or event slug is wrong, or the event type is
   hidden/unpublished. Copy the link from the event's public page in Cal.com.
2. Confirm `booking.defaultEvent` is also a real link; services without their
   own entry fall back to it.
3. Keep `https://app.cal.com` in the CSP `frame-src` (already set in
   `next.config.ts`).
4. Ad-blockers and privacy extensions can block the Cal.com iframe. Test in a
   private window with extensions disabled.
5. The fallback also appears if the iframe is still empty after 8 seconds; the
   retry button reloads it.

## Contact form

The form on `/contact` posts JSON to `POST /api/contact`.

- Validation: Zod schema in `src/lib/validation/contact.ts` (shared by the API route). Invalid requests return `422` with per-field messages; malformed JSON returns `400`.
- Email: sent with Resend to the clinic address in the config. Requires `RESEND_API_KEY` and `EMAIL_FROM` in `.env.local`; `EMAIL_FROM` must be a verified sender/domain in Resend. Without a key the route returns a JSON `503` and the form tells visitors to call instead.
- Spam: a hidden honeypot field is accepted silently.
- All failures return JSON `{ error, fieldErrors? }` and the form shows an alert.

## Google reviews

`<ReviewsWidget />` is used on the home page and on every studio page. It shows
the average rating, the total number of reviews, up to five review cards, a
"See all reviews on Google" link and a "Write a review" button.

- Data comes from `src/lib/reviews.ts`, which calls the Google Places API (New)
  for `siteConfig.googlePlaceId` with the server-side `GOOGLE_PLACES_API_KEY`.
  The request uses `next: { revalidate: 86400 }`, so reviews are cached for 24
  hours.
- If the key is missing or Google returns an error, the widget falls back to the
  sample reviews and rating in `siteConfig.reviews` and labels them as samples.
  A third-party outage never breaks a page.
- The `Dentist` JSON-LD only gets `aggregateRating` when the numbers came from
  Google (`aggregateRatingFrom()` returns `null` for sample data).
- The footer and contact page link to the Business Profile (`googlePlaceHref`)
  and to its Maps entry (`googleMapHref`). Changing `googlePlaceId` in the config
  updates the map, review and write-review links everywhere.

## Analytics and contact tracking

Tracking is consent-gated and privacy-light: contact events never include names,
emails, phone numbers or IP addresses.

### Cookie consent and GA4

- `<Analytics />` in the root layout renders a small accept/decline banner until
  the visitor chooses. The choice is stored in `localStorage` under
  `cookie-consent`; the footer link "Cookie settings" re-opens the banner.
- GA4 is injected with `next/script` **only after consent**, and
  `window['ga-disable-<id>']` stops collection if consent is withdrawn. Set the
  Measurement ID in `NEXT_PUBLIC_GA_ID`; leave it empty to disable GA entirely
  (the contact-event log still works).
- `trackEvent()` in `src/lib/track.ts` returns early unless
  `hasAnalyticsConsent()` is true, so no event reaches GA4 or the database
  before the visitor accepts.
- App Router navigations send a `page_view` event, since GA4 only sees the first
  page load by itself.

### Contact events

`src/lib/track.ts` sends every interaction to GA4 (when consented) and to
`POST /api/track`, which stores it in `contact_events`:

| Event | Fired when |
| --- | --- |
| `click_call` | A `tel:` link is clicked |
| `click_whatsapp` | A WhatsApp click-to-chat link is clicked |
| `click_directions` | A Google Maps/directions link is clicked |
| `start_booking` | A treatment is selected on `/book`, including via `?service=<slug>` |
| `complete_booking` | Cal.com fires `bookingSuccessfulV2` inside the embed |
| `submit_contact_form` | The contact form is accepted |

Each event records the page path, the placement (`header`, `footer`,
`mobile-bar`, `booking-page`, `cal-embed`, …), optional treatment/studio slugs,
and the first-touch UTM parameters (kept in `sessionStorage` so a booking
completed on `/book` still carries the campaign). The API validates the payload
with Zod and always answers `202`, so analytics can never break a booking;
without `DATABASE_URL` events are accepted but not stored.

The tracked CTA components in `src/components/analytics/tracked-links.tsx` let
server components stay server-rendered while attaching `onClick` tracking.

### WhatsApp button

`<WhatsAppButton />` builds `https://wa.me/<number>?text=…` from the config and
appends the treatment page the visitor is reading to the prefilled message. It
floats on desktop and sits in the sticky mobile bar, next to Call and Book.

### Admin dashboard

`/admin/analytics` shows counts by event type and a per-day breakdown for the
last 30 days in the clinic time zone (`siteConfig.timeZone`). Protect it with
`ADMIN_PASSWORD`: `src/middleware.ts` applies HTTP Basic auth (any username) to
`/admin/*`, answers `503` when the variable is unset, and the page is excluded
from indexing and from the sitemap.

## Gallery imagery

The six files in `public/gallery/` are generated SVG illustrations, not patient photos. Replace them with real before/after images (with written patient consent), update the paths and alt text in the config, and keep the consent note accurate.

## Deployment

### Vercel (recommended)

1. Push the repository to GitHub/GitLab and import it in Vercel. The default
   Next.js build settings work (`npm run build`).
2. Create the Cal.com event types and put their links in `booking.eventTypes`.
   No Cal.com API key is needed on the server.
3. Optionally create a Neon Postgres database and add the pooled connection
   string as `DATABASE_URL` for contact-event analytics.
4. Add the production values for every variable you use (see the table above).
   Set `NEXT_PUBLIC_SITE_URL` to the final origin, for example
   `https://www.yourclinic.com`.
5. Apply migrations if you use the analytics table:
   ```bash
   DATABASE_URL="postgresql://…" npm run db:migrate
   ```
   Run this from your machine or a CI step whenever `drizzle/` changes.
6. Verify the Resend domain and set `EMAIL_FROM` to an address on it. Send a test
   contact message.
7. Enable the Places API (New) for `GOOGLE_PLACES_API_KEY`; confirm the Place ID
   in `siteConfig` matches the clinic's Business Profile.
8. Add `NEXT_PUBLIC_GA_ID` and a strong `ADMIN_PASSWORD`.
9. Add the custom domain in Vercel, update `NEXT_PUBLIC_SITE_URL` if it changed,
   and redeploy so canonical URLs, the sitemap and JSON-LD use the final origin.
10. Smoke-test in production: `/`, `/services/…`, `/locations/…`, `/book` with a
    real booking (check the Cal.com confirmation email and cancel/reschedule
    links), the contact form, `/admin/analytics` (expects the browser password
    prompt), and `curl -I https://…` for the security headers.

### Self-hosted Node

```bash
npm ci
npm run build
npm run db:migrate   # only if you use contact-event analytics
npm start            # serves on port 3000; use PORT to override
```

Put the app behind an HTTPS reverse proxy (Caddy, nginx, a load balancer) and
pass the environment variables above. Avoid running `next dev` in production and
do not deploy while a dev server is writing to `.next`.

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm start` — serve the production build
- `npm run lint` — ESLint
- `npm test` — Vitest unit tests (review helpers)
- `npm run db:generate` / `db:migrate` / `db:push` / `db:studio` — Drizzle migrations and studio

## Notes

- Placeholder content describes a fictional clinic ("Lumen Dental Studio"). Replace it in the config before launch.
- Online booking is delegated to Cal.com by design; the site has no booking database, availability engine or calendar integration.
- `src/` has no AI features; a separate service will add them later.



 <!-- eventTypes: {
      implants: "lumen-dental/implants",
      braces: "lumen-dental/braces-aligners",
      "teeth-whitening": "lumen-dental/teeth-whitening",
      "emergency-dentist": "lumen-dental/emergency-dentist",
      "general-checkup": "lumen-dental/general-checkup",
    }, -->


…or create a new repository on the command line
echo "# dental-clinic-demo" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/mmasood786/dental-clinic-demo.git
git push -u origin main
…or push an existing repository from the command line
git remote add origin https://github.com/mmasood786/dental-clinic-demo.git
git branch -M main
git push -u origin main