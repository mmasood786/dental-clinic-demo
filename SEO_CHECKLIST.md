# SEO checklist

Technical SEO is generated from `src/config/site.config.ts`. Everything in this
file is the manual work that has to happen outside the codebase.

## 1. Google Search Console

- [ ] Verify the property for `siteConfig.url` (DNS or HTML tag — the DNS method
      survives redeploys).
- [ ] Submit `https://<domain>/sitemap.xml`.
- [ ] Check `https://<domain>/robots.txt` in the URL Inspection tool: it should
      allow `/` and block `/api/` and `/cancel`.
- [ ] Expect the generated sitemap to list: home, `/services`, `/locations`,
      `/book`, `/insurance-pricing`, `/about`, `/gallery`, `/contact`, every
      `/services/<slug>`, every `/locations/<slug>`, and each combined
      `/locations/<studio>/<service>` page.
- [ ] Re-run URL Inspection on `/` and one combined page after the first deploy
      to confirm they are indexed and canonicalised to the domain.

## 2. Google Business Profile (per studio)

- [ ] Create or claim a profile for **each** studio in
      `siteConfig.locations`, using the exact `name`, `address`, `phone` and
      `openingHours` values from the config.
- [ ] Set the primary category to **Dentist** and the website to the studio
      page (`/locations/<slug>`), not the homepage.
- [ ] Link the location page as the appointment URL where available.
- [ ] Add the same services as the website and keep prices in sync with
      `siteConfig.pricing`.
- [ ] Upload real photos of the studio, team and reception; refresh quarterly.
- [ ] Ask new patients for reviews and reply to every review. The website shows
      live Google reviews (and only advertises `aggregateRating` structured data)
      once `GOOGLE_PLACES_API_KEY` is set and the key can read
      `siteConfig.googlePlaceId` through the Places API (New). Until then the
      sample reviews from `siteConfig.reviews` are shown and labelled as samples.
- [ ] Enable "Places API (New)" on the Google Cloud project, restrict the key to
      the server, and set a quota/budget alert.

## 3. NAP consistency

Name, address and phone must match `siteConfig` exactly everywhere:

- [ ] Website footer, contact page, location pages and schema markup (automatic —
      they all read from the config).
- [ ] Google Business Profile for both studios.
- [ ] Apple Business Connect / Apple Maps.
- [ ] Bing Places.
- [ ] Yelp, Healthgrades, Zocdoc, RealSelf, Nextdoor and any local directories
      already listing the practice.
- [ ] Dental association and insurance "find a dentist" directories.
- [ ] Use the full street format from the config (`2401 Riverside Drive, Suite
      120`) rather than abbreviations, and never use a different tracked phone
      number in a listing unless call tracking is a deliberate choice.

## 4. Structured data validation

- [ ] Paste every page type into the
      [Rich Results Test](https://search.google.com/test/rich-results):
      home, `/services/<slug>`, `/locations/<slug>`,
      `/locations/<slug>/<service>`, `/contact`.
- [ ] Expected types: `Dentist` (with `address`, `geo`,
      `openingHoursSpecification`, `telephone`, `sameAs`, `priceRange`),
      `Service`, `FAQPage` (home and service pages), `BreadcrumbList` on every
      page, `WebSite` on the home page.
- [ ] Watch for two errors that commonly appear here: a missing `image` on the
      `Dentist` node (add a real photo of each studio when available) and
      `FAQPage` answers that differ from the visible text.
- [ ] Re-check after editing `site.config.ts`.

## 5. Social sharing

- [ ] Run `/`, `/services/<slug>` and `/locations/<slug>/<service>` through the
      [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
      and the [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/).
- [ ] Confirm the default OG image from `src/app/opengraph-image.tsx` renders
      and shows the clinic name, city and phone number.
- [ ] Replace it with a branded per-page image later if social traffic matters.

## 6. Local content and citations

- [ ] Publish a page or blog post for each target area in
      `siteConfig.seo.areaServed` before adding more combined pages — the
      combined pages work best when they link into real local content.
- [ ] Mention the areas served naturally in location copy
      (`siteConfig.locations[].description`).
- [ ] Keep the combined `/locations/<studio>/<service>` pages unique: they pull
      the studio description, prices and booking steps from the config, so
      editing those values updates all of them at once.

## 7. Performance and accessibility baseline

- [ ] Run Lighthouse mobile on `/` and one combined page; target 90+.
- [ ] Confirm every page has exactly one `<h1>` and that the breadcrumb trail
      shown in the hero matches the `BreadcrumbList` markup.
- [ ] Check that no page has `noindex` except `/cancel`.

## 8. Ongoing

- [ ] Monthly: check Search Console coverage and Core Web Vitals.
- [ ] Monthly: review GBP insights (calls, direction requests, bookings).
- [ ] Quarterly: refresh photos, re-check prices and opening hours in both the
      config and every directory listing.
