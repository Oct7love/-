import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  jsonb,
  integer,
  boolean,
  decimal,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    emailVerified: timestamp("email_verified", { withTimezone: true }),
    passwordHash: varchar("password_hash", { length: 255 }),
    name: varchar("name", { length: 100 }),
    avatarUrl: varchar("avatar_url", { length: 500 }),
    phone: varchar("phone", { length: 20 }).unique(),
    provider: varchar("provider", { length: 50 }).default("email"),
    providerId: varchar("provider_id", { length: 255 }),
    role: varchar("role", { length: 20 }).default("user"),
    status: varchar("status", { length: 20 }).default("active"),
    preferences: jsonb("preferences").default({}),
    lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    index("idx_users_provider").on(table.provider, table.providerId),
  ]
);

export const resumes = pgTable(
  "resumes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 200 }).notNull().default("未命名简历"),
    status: varchar("status", { length: 20 }).default("draft"),
    language: varchar("language", { length: 10 }).default("zh-CN"),
    sourceType: varchar("source_type", { length: 20 }).default("upload"),
    sourceFileUrl: varchar("source_file_url", { length: 500 }),
    sourceFileName: varchar("source_file_name", { length: 255 }),
    content: jsonb("content").notNull().default({}),
    currentVersion: integer("current_version").default(1),
    templateId: uuid("template_id"),
    templateConfig: jsonb("template_config").default({}),
    lastScore: integer("last_score"),
    lastDiagnosedAt: timestamp("last_diagnosed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    index("idx_resumes_user_id").on(table.userId),
  ]
);

export const resumeVersions = pgTable(
  "resume_versions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    resumeId: uuid("resume_id")
      .notNull()
      .references(() => resumes.id, { onDelete: "cascade" }),
    versionNumber: integer("version_number").notNull(),
    content: jsonb("content").notNull(),
    changeSummary: varchar("change_summary", { length: 500 }),
    changeType: varchar("change_type", { length: 20 }).default("manual"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    uniqueIndex("idx_resume_version_unique").on(
      table.resumeId,
      table.versionNumber
    ),
  ]
);

export const diagnoses = pgTable(
  "diagnoses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    resumeId: uuid("resume_id")
      .notNull()
      .references(() => resumes.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    totalScore: integer("total_score").notNull(),
    dimensions: jsonb("dimensions").notNull(),
    overallSummary: text("overall_summary"),
    modelUsed: varchar("model_used", { length: 50 }),
    tokensUsed: integer("tokens_used"),
    processingTimeMs: integer("processing_time_ms"),
    jdRecordId: uuid("jd_record_id"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index("idx_diagnoses_resume").on(table.resumeId),
    index("idx_diagnoses_user").on(table.userId),
  ]
);

export const diagnosisItems = pgTable(
  "diagnosis_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    diagnosisId: uuid("diagnosis_id")
      .notNull()
      .references(() => diagnoses.id, { onDelete: "cascade" }),
    section: varchar("section", { length: 50 }).notNull(),
    fieldPath: varchar("field_path", { length: 200 }),
    severity: varchar("severity", { length: 10 }).notNull(),
    category: varchar("category", { length: 50 }).notNull(),
    originalText: text("original_text"),
    suggestion: text("suggestion").notNull(),
    rewrittenText: text("rewritten_text"),
    isAdopted: boolean("is_adopted").default(false),
    sortOrder: integer("sort_order").default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index("idx_diagnosis_items_diagnosis").on(table.diagnosisId),
  ]
);

export const templates = pgTable(
  "templates",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 100 }).notNull(),
    slug: varchar("slug", { length: 100 }).notNull().unique(),
    description: text("description"),
    category: varchar("category", { length: 50 }).notNull(),
    thumbnailUrl: varchar("thumbnail_url", { length: 500 }),
    previewUrl: varchar("preview_url", { length: 500 }),
    config: jsonb("config").notNull().default({}),
    isPremium: boolean("is_premium").default(false),
    isActive: boolean("is_active").default(true),
    sortOrder: integer("sort_order").default(0),
    usageCount: integer("usage_count").default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index("idx_templates_category").on(table.category),
  ]
);

export const plans = pgTable("plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 50 }).notNull(),
  displayName: varchar("display_name", { length: 100 }).notNull(),
  description: text("description"),
  priceMonthly: decimal("price_monthly", { precision: 10, scale: 2 }),
  priceYearly: decimal("price_yearly", { precision: 10, scale: 2 }),
  features: jsonb("features").notNull().default({}),
  limits: jsonb("limits").notNull().default({}),
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const subscriptions = pgTable(
  "subscriptions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    planId: uuid("plan_id")
      .notNull()
      .references(() => plans.id),
    status: varchar("status", { length: 20 }).notNull().default("active"),
    billingCycle: varchar("billing_cycle", { length: 10 }).notNull(),
    stripeSubscriptionId: varchar("stripe_subscription_id", {
      length: 100,
    }).unique(),
    stripeCustomerId: varchar("stripe_customer_id", { length: 100 }),
    currentPeriodStart: timestamp("current_period_start", {
      withTimezone: true,
    }).notNull(),
    currentPeriodEnd: timestamp("current_period_end", {
      withTimezone: true,
    }).notNull(),
    cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
    canceledAt: timestamp("canceled_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index("idx_subscriptions_user").on(table.userId),
  ]
);

export const usageRecords = pgTable(
  "usage_records",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    action: varchar("action", { length: 50 }).notNull(),
    resumeId: uuid("resume_id"),
    tokensUsed: integer("tokens_used").default(0),
    costCents: integer("cost_cents").default(0),
    metadata: jsonb("metadata").default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index("idx_usage_user_action").on(table.userId, table.action),
  ]
);
