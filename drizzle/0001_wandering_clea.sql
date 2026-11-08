CREATE TABLE "contact_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_name" text NOT NULL,
	"page_path" text NOT NULL,
	"utm_source" text,
	"utm_medium" text,
	"utm_campaign" text,
	"utm_term" text,
	"utm_content" text,
	"service_slug" text,
	"location_slug" text,
	"placement" text,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "contact_events_created_at_idx" ON "contact_events" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "contact_events_event_name_idx" ON "contact_events" USING btree ("event_name");