import pg from 'pg';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate as drizzleMigrate } from 'drizzle-orm/node-postgres/migrator';
import { sql } from 'drizzle-orm';
import { installation } from './schema.js';
import { adoptLegacyMigration, verifyMigrationHistory } from './migration-history.js';
export async function migrate(
  url: string,
  directory = resolve(
    process.env.MIGRATIONS_DIR ?? fileURLToPath(new URL('../migrations/', import.meta.url)),
  ),
) {
  const client = new pg.Client({ connectionString: url });
  await client.connect();
  const db = drizzle(client);
  const config = { migrationsFolder: directory, migrationsSchema: 'drizzle' };
  try {
    await db.execute(sql`SELECT pg_advisory_lock(726401)`);
    await adoptLegacyMigration(db, config);
    await verifyMigrationHistory(db, config);
    await drizzleMigrate(db, config);
    await db.insert(installation).values({ id: true }).onConflictDoNothing();
  } finally {
    try {
      await db.execute(sql`SELECT pg_advisory_unlock(726401)`);
    } finally {
      await client.end();
    }
  }
}
if (process.argv[1]?.endsWith('/migrate.ts') || process.argv[1]?.endsWith('/migrate.js')) {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL ausente');
  await migrate(process.env.DATABASE_URL);
}
