import { z } from "zod";

import { TRACK_EVENTS } from "@/lib/track";

const utmSchema = z.object({
  source: z.string().trim().max(128).optional(),
  medium: z.string().trim().max(128).optional(),
  campaign: z.string().trim().max(128).optional(),
  term: z.string().trim().max(128).optional(),
  content: z.string().trim().max(128).optional(),
});

/** Body accepted by `POST /api/track`, produced by `src/lib/track.ts`. */
export const trackSchema = z.object({
  event: z.enum(TRACK_EVENTS),
  path: z.string().trim().min(1).max(512),
  utm: utmSchema.nullish(),
  service: z.string().trim().max(80).nullish(),
  location: z.string().trim().max(80).nullish(),
  placement: z.string().trim().max(60).nullish(),
  timestamp: z
    .string()
    .max(40)
    .refine((value) => !Number.isNaN(Date.parse(value)), {
      message: "Invalid timestamp.",
    })
    .optional(),
});

export type TrackInput = z.infer<typeof trackSchema>;
