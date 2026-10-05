import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema.js';
export * from './schema.js';
export function database(url: string) {
  const pool = new pg.Pool({ connectionString: url, max: 10 });
  const db = drizzle(pool, { schema });
  return { db, pool };
}
export type DB = ReturnType<typeof database>['db'];
export type TX = Parameters<Parameters<DB['transaction']>[0]>[0];
export type Store = DB | TX;
export type RecordRow = typeof schema.records.$inferSelect;
export type SpaceRow = typeof schema.spaces.$inferSelect;
