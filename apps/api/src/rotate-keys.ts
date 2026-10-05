import { and, ne, eq, sql } from 'drizzle-orm';
import { database, spaces } from './db.js';
import { Service } from './service.js';
import { readConfig } from './config.js';
import { encrypt } from './crypto.js';
const config = readConfig();
const { db, pool } = database(config.DATABASE_URL);
const service = new Service(db, config);
try {
  await db.transaction(async (tx) => {
    await tx.execute(sql`SELECT pg_advisory_xact_lock(726402)`);
    const rows = await tx
      .select()
      .from(spaces)
      .where(ne(spaces.keyVersion, config.ACTIVE_MASTER_KEY))
      .for('update');
    for (const space of rows) {
      const key = service.key(space);
      await tx
        .update(spaces)
        .set({
          wrappedKey: encrypt(
            service.masterKeys[config.ACTIVE_MASTER_KEY],
            `space-key:${space.id}`,
            key.toString('base64'),
          ),
          keyVersion: config.ACTIVE_MASTER_KEY,
        })
        .where(eq(spaces.id, space.id));
    }
    process.stdout.write(`${rows.length} espaços migrados para ${config.ACTIVE_MASTER_KEY}\n`);
  });
} finally {
  await pool.end();
}
