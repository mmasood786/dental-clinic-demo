import { z } from "zod";

import { siteConfig } from "@/config/site.config";

const serviceSlugs = new Set(
  siteConfig.services.map((service) => service.slug),
);
const locationSlugs = new Set(
  siteConfig.locations.map((location) => location.slug),
);

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name.")
    .max(80, "Please keep your name under 80 characters."),
  email: z
    .email("Enter a valid email address.")
    .max(160, "Please keep your email under 160 characters."),
  phone: z
    .string()
    .trim()
    .max(30, "Please keep your phone number under 30 characters.")
    .optional()
    .default(""),
  service: z
    .string()
    .trim()
    .optional()
    .default("")
    .refine(
      (value) => value === "" || serviceSlugs.has(value),
      "Choose a treatment from the list.",
    ),
  location: z
    .string()
    .trim()
    .optional()
    .default("")
    .refine(
      (value) => value === "" || locationSlugs.has(value),
      "Choose a studio from the list.",
    ),
  message: z
    .string()
    .trim()
    .min(10, "Please tell us a little more (at least 10 characters).")
    .max(2000, "Please keep your message under 2,000 characters."),
  /** Honeypot field: real users never fill this in. */
  website: z.string().max(200).optional().default(""),
});

export type ContactInput = z.infer<typeof contactSchema>;
