CREATE TYPE "public"."appointment_status" AS ENUM('confirmed', 'cancelled', 'completed', 'no_show');--> statement-breakpoint
CREATE TABLE "appointments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"service_slug" text NOT NULL,
	"location_slug" text NOT NULL,
	"starts_at" timestamp with time zone NOT NULL,
	"ends_at" timestamp with time zone NOT NULL,
	"patient_name" text NOT NULL,
	"patient_email" text NOT NULL,
	"patient_phone" text NOT NULL,
	"notes" text,
	"status" "appointment_status" DEFAULT 'confirmed' NOT NULL,
	"source" text DEFAULT 'website' NOT NULL,
	"cancel_token" text NOT NULL,
	"google_event_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blocked_slots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"location_slug" text NOT NULL,
	"starts_at" timestamp with time zone NOT NULL,
	"ends_at" timestamp with time zone NOT NULL,
	"reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "appointments_confirmed_slot_unique" ON "appointments" USING btree ("location_slug","starts_at") WHERE "appointments"."status" = 'confirmed';--> statement-breakpoint
CREATE INDEX "appointments_location_starts_at_idx" ON "appointments" USING btree ("location_slug","starts_at");--> statement-breakpoint
CREATE UNIQUE INDEX "appointments_cancel_token_unique" ON "appointments" USING btree ("cancel_token");--> statement-breakpoint
CREATE INDEX "blocked_slots_location_starts_at_idx" ON "blocked_slots" USING btree ("location_slug","starts_at");