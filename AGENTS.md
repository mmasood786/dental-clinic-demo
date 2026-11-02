# Project: Dental clinic website (reusable template for QodeForge)

Stack (do not add other libraries without asking): Next.js 15 App Router, TypeScript (strict), Tailwind CSS, Neon Postgres with Drizzle ORM, Zod, Resend (email), googleapis (Google Calendar), date-fns-tz.

Rules:
- All clinic-specific content (name, phone, address, hours, services, locations, social links, colors, WhatsApp number, Google Place ID, calendar ID) lives in ONE file: src/config/site.config.ts. No clinic data hardcoded in components, so the project can be reused for other clinics.
- Mobile-first. Target Lighthouse mobile score 90+. Use next/image, next/font, server components by default.
- Secrets only in .env.local; maintain .env.example with every variable and a one-line comment.
- Every API route validates input with Zod and returns JSON errors.
- Add no AI features in this project. A separate service will do that later.
- After each task: run `npm run build` and `npm run lint`, fix all errors, then stop and summarize what changed. Do not start the next task.