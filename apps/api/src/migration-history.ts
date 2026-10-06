// One-time adoption of the released SQL migration; regular migrations use Drizzle's migrator.
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { sql } from 'drizzle-orm';
import { readMigrationFiles, type MigrationConfig } from 'drizzle-orm/migrator';
import { type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { pgTable, pgSchema, text, serial, bigint } from 'drizzle-orm/pg-core';

const legacyHistory = pgTable('schema_migrations', { name: text().primaryKey() });
const history = pgSchema('drizzle').table('__drizzle_migrations', {
  id: serial().primaryKey(),
  hash: text().notNull(),
  createdAt: bigint('created_at', { mode: 'number' }),
});
async function exists(db: NodePgDatabase, name: string) {
  const r = await db.execute<{ present: boolean }>(
    sql`SELECT to_regclass(${name}) IS NOT NULL AS present`,
  );
  return r.rows[0].present;
}
type BaselineTable = {
  name: string;
  columns: Record<
    string,
    {
      name: string;
      type: string;
      notNull: boolean;
      primaryKey: boolean;
      default?: string | boolean | number;
    }
  >;
  foreignKeys: Record<string, unknown>;
  compositePrimaryKeys: Record<string, unknown>;
  uniqueConstraints: Record<string, unknown>;
  checkConstraints: Record<string, unknown>;
  indexes: Record<string, { isUnique: boolean; columns: { expression: string }[] }>;
};
async function verifyLegacySchema(db: NodePgDatabase, folder: string) {
  // Use the immutable initial snapshot, rather than a future version of the TypeScript schema.
  const snapshot = JSON.parse(
    await readFile(resolve(folder, 'meta/0000_snapshot.json'), 'utf8'),
  ) as { tables: Record<string, BaselineTable> };
  const columns = (
    await db.execute<{
      table: string;
      name: string;
      type: string;
      notNull: boolean;
      default: string | null;
    }>(sql`
    SELECT c.relname AS "table", a.attname AS name, format_type(a.atttypid,a.atttypmod) AS type,
      a.attnotnull AS "notNull", pg_get_expr(d.adbin,d.adrelid) AS "default"
    FROM pg_attribute a JOIN pg_class c ON c.oid=a.attrelid
    JOIN pg_namespace n ON n.oid=c.relnamespace
    LEFT JOIN pg_attrdef d ON d.adrelid=c.oid AND d.adnum=a.attnum
    WHERE n.nspname='public' AND a.attnum>0 AND NOT a.attisdropped AND c.relkind='r'
  `)
  ).rows;
  const constraints = (
    await db.execute<{ table: string; name: string; valid: boolean }>(sql`
    SELECT c.relname AS "table", k.conname AS name, k.convalidated AS valid
    FROM pg_constraint k JOIN pg_class c ON c.oid=k.conrelid
    JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public'
  `)
  ).rows;
  const indexes = (
    await db.execute<{
      table: string;
      name: string;
      unique: boolean;
      valid: boolean;
      columns: string[];
    }>(sql`
    SELECT t.relname AS "table", i.relname AS name, x.indisunique AS "unique", x.indisvalid AS valid,
    ARRAY(SELECT a.attname::text FROM unnest(x.indkey) WITH ORDINALITY k(num,pos)
        JOIN pg_attribute a ON a.attrelid=t.oid AND a.attnum=k.num ORDER BY k.pos) AS columns
    FROM pg_index x JOIN pg_class t ON t.oid=x.indrelid JOIN pg_class i ON i.oid=x.indexrelid
    JOIN pg_namespace n ON n.oid=t.relnamespace WHERE n.nspname='public'
  `)
  ).rows;
  for (const t of Object.values(snapshot.tables)) {
    const actual = columns.filter((c) => c.table === t.name);
    const expected = Object.values(t.columns);
    let valid =
      actual.length === expected.length &&
      expected.every((c) =>
        actual.some(
          (a) =>
            a.name === c.name &&
            a.type === c.type &&
            a.notNull === c.notNull &&
            a.default === (c.default === undefined ? null : String(c.default)),
        ),
      );
    const names = [
      ...Object.keys(t.foreignKeys),
      ...Object.keys(t.compositePrimaryKeys),
      ...Object.keys(t.uniqueConstraints),
      ...Object.keys(t.checkConstraints),
    ];
    if (expected.some((c) => c.primaryKey)) names.push(`${t.name}_pkey`);
    valid &&= names.every((name) =>
      constraints.some((c) => c.table === t.name && c.name === name && c.valid),
    );
    valid &&= Object.entries(t.indexes).every(([name, index]) =>
      indexes.some(
        (i) =>
          i.table === t.name &&
          i.name === name &&
          i.valid &&
          i.unique === index.isUnique &&
          JSON.stringify(i.columns) === JSON.stringify(index.columns.map((c) => c.expression)),
      ),
    );
    if (!valid)
      throw new Error(
        `Schema legado divergente em ${t.name}; nenhuma migration foi adotada. Revise o banco antes de atualizar.`,
      );
  }
}
export async function adoptLegacyMigration(db: NodePgDatabase, config: MigrationConfig) {
  const hasLegacy = await exists(db, 'public.schema_migrations');
  if (await exists(db, 'drizzle.__drizzle_migrations')) {
    if ((await db.select().from(history).limit(1)).length) {
      if (hasLegacy)
        throw new Error(
          'Históricos SQL e Drizzle coexistem. Restaure o backup legado em um banco vazio antes de migrar.',
        );
      return;
    }
  }
  if (!hasLegacy) return;
  const applied = await db.select().from(legacyHistory);
  if (applied.length !== 1 || applied[0].name !== '0001_initial.sql')
    throw new Error('Histórico SQL legado desconhecido; o banco não foi alterado.');
  await verifyLegacySchema(db, config.migrationsFolder);
  const [baseline] = readMigrationFiles(config);
  if (!baseline) throw new Error('Migration inicial do Drizzle ausente');
  await db.transaction(async (tx) => {
    // Bootstrap the official history table only for the legacy baseline.
    await tx.execute(sql`CREATE SCHEMA IF NOT EXISTS drizzle`);
    await tx.execute(
      sql`CREATE TABLE IF NOT EXISTS drizzle.__drizzle_migrations (id SERIAL PRIMARY KEY, hash text NOT NULL, created_at bigint)`,
    );
    await tx.insert(history).values({ hash: baseline.hash, createdAt: baseline.folderMillis });
    await tx.execute(sql`DROP TABLE public.schema_migrations`);
  });
}
export async function verifyMigrationHistory(db: NodePgDatabase, config: MigrationConfig) {
  if (!(await exists(db, 'drizzle.__drizzle_migrations'))) return;
  const files = readMigrationFiles(config);
  for (const applied of await db.select().from(history)) {
    const original = files.find((f) => f.folderMillis === applied.createdAt);
    if (!original || original.hash !== applied.hash)
      throw new Error(
        'Histórico de migrations incompatível: arquivo aplicado ausente ou alterado.',
      );
  }
}
