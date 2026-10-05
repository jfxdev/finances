CREATE TABLE "api_keys" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"token_hash" text NOT NULL,
	"grants" jsonb NOT NULL,
	"expires_at" timestamp with time zone,
	"revoked_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "api_keys_token_hash_key" UNIQUE("token_hash")
);
--> statement-breakpoint
CREATE TABLE "audits" (
	"id" uuid PRIMARY KEY NOT NULL,
	"actor_id" uuid,
	"key_id" uuid,
	"space_id" uuid,
	"resource" text,
	"record_id" uuid,
	"operation" text NOT NULL,
	"result" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "idempotencies" (
	"actor_id" uuid NOT NULL,
	"key_id" text NOT NULL,
	"token" text NOT NULL,
	"request_hash" text NOT NULL,
	"space_id" uuid NOT NULL,
	"record_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "idempotencies_pkey" PRIMARY KEY("actor_id","key_id","token")
);
--> statement-breakpoint
CREATE TABLE "installation" (
	"id" boolean PRIMARY KEY DEFAULT true NOT NULL,
	"configured" boolean DEFAULT false NOT NULL,
	CONSTRAINT "installation_id_check" CHECK ("installation"."id")
);
--> statement-breakpoint
CREATE TABLE "invites" (
	"token_hash" text PRIMARY KEY NOT NULL,
	"space_id" uuid NOT NULL,
	"role" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"used_at" timestamp with time zone,
	CONSTRAINT "invites_role_check" CHECK ("invites"."role" IN ('editor','reader'))
);
--> statement-breakpoint
CREATE TABLE "members" (
	"space_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role" text NOT NULL,
	CONSTRAINT "members_pkey" PRIMARY KEY("space_id","user_id"),
	CONSTRAINT "members_role_check" CHECK ("members"."role" IN ('owner','editor','reader'))
);
--> statement-breakpoint
CREATE TABLE "records" (
	"id" uuid PRIMARY KEY NOT NULL,
	"space_id" uuid NOT NULL,
	"resource" text NOT NULL,
	"payload" jsonb NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"category_id" uuid,
	"investment_id" uuid,
	"recurrence_id" uuid,
	"occurrence_date" date,
	"date" date,
	"effective_date" date,
	"status" text,
	"type" text,
	"deleted_at" timestamp with time zone,
	"deletion_reason" text,
	"created_by" uuid NOT NULL,
	"updated_by" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "records_space_id_id_key" UNIQUE("space_id","id"),
	CONSTRAINT "records_recurrence_id_occurrence_date_key" UNIQUE("recurrence_id","occurrence_date"),
	CONSTRAINT "records_resource_check" CHECK ("records"."resource" IN ('categories','expenses','incomes','recurrences','investments','movements','valuations'))
);
--> statement-breakpoint
CREATE TABLE "resets" (
	"token_hash" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"used_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"token_hash" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"csrf" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "spaces" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" jsonb NOT NULL,
	"currency" text NOT NULL,
	"timezone" text NOT NULL,
	"personal" boolean NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"wrapped_key" jsonb NOT NULL,
	"key_version" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"password_hash" text NOT NULL,
	"admin" boolean DEFAULT false NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "users_email_key" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audits" ADD CONSTRAINT "audits_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audits" ADD CONSTRAINT "audits_key_id_fkey" FOREIGN KEY ("key_id") REFERENCES "public"."api_keys"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audits" ADD CONSTRAINT "audits_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "public"."spaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "idempotencies" ADD CONSTRAINT "idempotencies_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "idempotencies" ADD CONSTRAINT "idempotencies_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "public"."spaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "idempotencies" ADD CONSTRAINT "idempotencies_record_id_fkey" FOREIGN KEY ("record_id") REFERENCES "public"."records"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invites" ADD CONSTRAINT "invites_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "public"."spaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "members" ADD CONSTRAINT "members_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "public"."spaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "members" ADD CONSTRAINT "members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "records" ADD CONSTRAINT "records_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "public"."spaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "records" ADD CONSTRAINT "records_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "records" ADD CONSTRAINT "records_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "records" ADD CONSTRAINT "records_space_id_category_id_fkey" FOREIGN KEY ("space_id","category_id") REFERENCES "public"."records"("space_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "records" ADD CONSTRAINT "records_space_id_investment_id_fkey" FOREIGN KEY ("space_id","investment_id") REFERENCES "public"."records"("space_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "records" ADD CONSTRAINT "records_space_id_recurrence_id_fkey" FOREIGN KEY ("space_id","recurrence_id") REFERENCES "public"."records"("space_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resets" ADD CONSTRAINT "resets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "one_owner_per_space" ON "members" USING btree ("space_id") WHERE "members"."role"='owner';--> statement-breakpoint
CREATE INDEX "records_period" ON "records" USING btree ("space_id","resource","date") WHERE "records"."deleted_at" IS NULL;--> statement-breakpoint
CREATE INDEX "records_effective" ON "records" USING btree ("space_id","resource","effective_date") WHERE "records"."deleted_at" IS NULL;--> statement-breakpoint
CREATE INDEX "records_investment" ON "records" USING btree ("space_id","investment_id","date") WHERE "records"."deleted_at" IS NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "valuation_per_day" ON "records" USING btree ("space_id","investment_id","date") WHERE "records"."resource"='valuations' AND "records"."deleted_at" IS NULL;