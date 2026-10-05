import { sql } from 'drizzle-orm';
import {
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  timestamp,
  jsonb,
  date,
  primaryKey,
  unique,
  foreignKey,
  check,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import type { Envelope } from './crypto.js';
import type { Grant, Resource } from '@finances/contracts';
export const installation = pgTable(
  'installation',
  {
    id: boolean().primaryKey().default(true),
    configured: boolean().notNull().default(false),
  },
  (t) => [check('installation_id_check', sql`${t.id}`)],
);
export const users = pgTable('users', {
  id: uuid().primaryKey(),
  email: text().notNull().unique('users_email_key'),
  name: text().notNull(),
  passwordHash: text('password_hash').notNull(),
  admin: boolean().notNull().default(false),
  active: boolean().notNull().default(true),
});
export const spaces = pgTable('spaces', {
  id: uuid().primaryKey(),
  title: jsonb().$type<Envelope>().notNull(),
  currency: text().notNull(),
  timezone: text().notNull(),
  personal: boolean().notNull(),
  version: integer().notNull().default(1),
  wrappedKey: jsonb('wrapped_key').$type<Envelope>().notNull(),
  keyVersion: text('key_version').notNull(),
});
export const members = pgTable(
  'members',
  {
    spaceId: uuid('space_id').notNull(),
    userId: uuid('user_id').notNull(),
    role: text().$type<'owner' | 'editor' | 'reader'>().notNull(),
  },
  (t) => [
    primaryKey({ name: 'members_pkey', columns: [t.spaceId, t.userId] }),
    foreignKey({
      name: 'members_space_id_fkey',
      columns: [t.spaceId],
      foreignColumns: [spaces.id],
    }),
    foreignKey({ name: 'members_user_id_fkey', columns: [t.userId], foreignColumns: [users.id] }),
    check('members_role_check', sql`${t.role} IN ('owner','editor','reader')`),
    uniqueIndex('one_owner_per_space')
      .on(t.spaceId)
      .where(sql`${t.role}='owner'`),
  ],
);
export const records = pgTable(
  'records',
  {
    id: uuid().primaryKey(),
    spaceId: uuid('space_id').notNull(),
    resource: text().$type<Resource>().notNull(),
    payload: jsonb().$type<Envelope>().notNull(),
    version: integer().notNull().default(1),
    categoryId: uuid('category_id'),
    investmentId: uuid('investment_id'),
    recurrenceId: uuid('recurrence_id'),
    occurrenceDate: date('occurrence_date'),
    date: date(),
    effectiveDate: date('effective_date'),
    status: text(),
    type: text(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
    deletionReason: text('deletion_reason'),
    createdBy: uuid('created_by').notNull(),
    updatedBy: uuid('updated_by').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    unique('records_space_id_id_key').on(t.spaceId, t.id),
    unique('records_recurrence_id_occurrence_date_key').on(t.recurrenceId, t.occurrenceDate),
    foreignKey({
      name: 'records_space_id_fkey',
      columns: [t.spaceId],
      foreignColumns: [spaces.id],
    }),
    foreignKey({
      name: 'records_created_by_fkey',
      columns: [t.createdBy],
      foreignColumns: [users.id],
    }),
    foreignKey({
      name: 'records_updated_by_fkey',
      columns: [t.updatedBy],
      foreignColumns: [users.id],
    }),
    foreignKey({
      name: 'records_space_id_category_id_fkey',
      columns: [t.spaceId, t.categoryId],
      foreignColumns: [t.spaceId, t.id],
    }),
    foreignKey({
      name: 'records_space_id_investment_id_fkey',
      columns: [t.spaceId, t.investmentId],
      foreignColumns: [t.spaceId, t.id],
    }),
    foreignKey({
      name: 'records_space_id_recurrence_id_fkey',
      columns: [t.spaceId, t.recurrenceId],
      foreignColumns: [t.spaceId, t.id],
    }),
    check(
      'records_resource_check',
      sql`${t.resource} IN ('categories','expenses','incomes','recurrences','investments','movements','valuations')`,
    ),
    index('records_period')
      .on(t.spaceId, t.resource, t.date)
      .where(sql`${t.deletedAt} IS NULL`),
    index('records_effective')
      .on(t.spaceId, t.resource, t.effectiveDate)
      .where(sql`${t.deletedAt} IS NULL`),
    index('records_investment')
      .on(t.spaceId, t.investmentId, t.date)
      .where(sql`${t.deletedAt} IS NULL`),
    uniqueIndex('valuation_per_day')
      .on(t.spaceId, t.investmentId, t.date)
      .where(sql`${t.resource}='valuations' AND ${t.deletedAt} IS NULL`),
  ],
);
export const sessions = pgTable(
  'sessions',
  {
    tokenHash: text('token_hash').primaryKey(),
    userId: uuid('user_id').notNull(),
    csrf: text().notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  },
  (t) => [
    foreignKey({ name: 'sessions_user_id_fkey', columns: [t.userId], foreignColumns: [users.id] }),
  ],
);
export const apiKeys = pgTable(
  'api_keys',
  {
    id: uuid().primaryKey(),
    userId: uuid('user_id').notNull(),
    name: text().notNull(),
    tokenHash: text('token_hash').notNull().unique('api_keys_token_hash_key'),
    grants: jsonb().$type<Grant[]>().notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }),
    revokedAt: timestamp('revoked_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    foreignKey({ name: 'api_keys_user_id_fkey', columns: [t.userId], foreignColumns: [users.id] }),
  ],
);
export const invites = pgTable(
  'invites',
  {
    tokenHash: text('token_hash').primaryKey(),
    spaceId: uuid('space_id').notNull(),
    role: text().$type<'editor' | 'reader'>().notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    usedAt: timestamp('used_at', { withTimezone: true }),
  },
  (t) => [
    foreignKey({
      name: 'invites_space_id_fkey',
      columns: [t.spaceId],
      foreignColumns: [spaces.id],
    }),
    check('invites_role_check', sql`${t.role} IN ('editor','reader')`),
  ],
);
export const resets = pgTable(
  'resets',
  {
    tokenHash: text('token_hash').primaryKey(),
    userId: uuid('user_id').notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    usedAt: timestamp('used_at', { withTimezone: true }),
  },
  (t) => [
    foreignKey({ name: 'resets_user_id_fkey', columns: [t.userId], foreignColumns: [users.id] }),
  ],
);
export const audits = pgTable(
  'audits',
  {
    id: uuid().primaryKey(),
    actorId: uuid('actor_id'),
    keyId: uuid('key_id'),
    spaceId: uuid('space_id'),
    resource: text(),
    recordId: uuid('record_id'),
    operation: text().notNull(),
    result: text().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    foreignKey({ name: 'audits_actor_id_fkey', columns: [t.actorId], foreignColumns: [users.id] }),
    foreignKey({ name: 'audits_key_id_fkey', columns: [t.keyId], foreignColumns: [apiKeys.id] }),
    foreignKey({ name: 'audits_space_id_fkey', columns: [t.spaceId], foreignColumns: [spaces.id] }),
  ],
);
export const idempotencies = pgTable(
  'idempotencies',
  {
    actorId: uuid('actor_id').notNull(),
    keyId: text('key_id').notNull(),
    token: text().notNull(),
    requestHash: text('request_hash').notNull(),
    spaceId: uuid('space_id').notNull(),
    recordId: uuid('record_id').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    primaryKey({ name: 'idempotencies_pkey', columns: [t.actorId, t.keyId, t.token] }),
    foreignKey({
      name: 'idempotencies_actor_id_fkey',
      columns: [t.actorId],
      foreignColumns: [users.id],
    }),
    foreignKey({
      name: 'idempotencies_space_id_fkey',
      columns: [t.spaceId],
      foreignColumns: [spaces.id],
    }),
    foreignKey({
      name: 'idempotencies_record_id_fkey',
      columns: [t.recordId],
      foreignColumns: [records.id],
    }),
  ],
);
