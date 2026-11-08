---
name: ui-design-system
description: Use for any visual, layout, styling, or UI change on the dental website. Defines the design system and conversion rules.
---

Look and feel: calm, clean, premium healthcare. Trustworthy, not clinical or cold.
- Color: use brand colors from site.config.ts. Build tokens: primary, primary-dark, accent (for CTAs), surface, soft background tint, text, muted text. Body text contrast must meet WCAG AA.
- Type: one heading font and one body font via next/font. Large confident headings, body 16-18px, generous line height.
- Space: consistent 8px scale, wide section padding, max content width ~1200px. Plenty of white space.
- Shape: rounded corners (12-20px), soft layered shadows, subtle gradients only on hero and CTA bands.
- Imagery: real photos of the clinic and team from config. Where none exist, use soft placeholder blocks, never fake people or stock-looking claims.
- Icons: lucide-react only (the single allowed extra dependency).
- Motion: subtle only (fade/slide-up on scroll, hover lift on cards, button press). Respect prefers-reduced-motion. No heavy animation libraries.

Conversion rules:
- One primary action per screen: "Book your visit". Secondary: call, WhatsApp.
- Every section ends in or near a CTA. Social proof (rating, review count) sits close to CTAs.
- Reduce fear: friendly microcopy, pricing transparency, "what to expect" steps.
- Never invent reviews, numbers, credentials, awards, or medical claims. Every figure comes from site.config.ts; if missing, omit the element.
- No guarantees or "painless" claims unless the clinic supplied them in config.

Technical: Tailwind only, server components by default, next/image everywhere, no layout shift, mobile-first, Lighthouse mobile 90+. Components in src/components, content from config.