import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest';
import pg from 'pg';
import { cp, mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { tmpdir } from 'node:os';
import { randomBytes } from 'node:crypto';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { migrate } from '../src/migrate.js';
import { buildApp } from '../src/app.js';

const url = process.env.TEST_DATABASE_URL;
if (!url || !new URL(url).pathname.endsWith('_test'))
  throw new Error('TEST_DATABASE_URL deve apontar para um banco exclusivo terminado em _test');
const client = new pg.Client({ connectionString: url });
const folder = resolve('migrations');
const temporary: string[] = [];
function launch(migrationsDirectory?: string) {
  const env: NodeJS.ProcessEnv = {
    ...process.env,
    DATABASE_URL: url!,
    MASTER_KEYS: JSON.stringify({ v1: randomBytes(32).toString('base64') }),
    ACTIVE_MASTER_KEY: 'v1',
    SETUP_TOKEN: 'boot-only-setup-token-for-finances',
    PUBLIC_URL: 'http://localhost:3000',
    NODE_ENV: 'test',
    PORT: '0',
  };
  delete env.MIGRATIONS_DIR;
  if (migrationsDirectory) env.MIGRATIONS_DIR = migrationsDirectory;
  const child = spawn(
    process.execPath,
    ['--import', createRequire(import.meta.url).resolve('tsx'), resolve('src/main.ts')],
    {
      cwd: resolve('../..'),
      env,
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  );
  let output = '';
  child.stdout.on('data', (chunk) => {
    output += chunk.toString();
  });
  child.stderr.on('data', (chunk) => {
    output += chunk.toString();
  });
  const exited = new Promise<number | null>((resolve, reject) => {
    child.once('error', reject);
    child.once('exit', resolve);
  });
  return { child, exited, output: () => output };
}
async function ready(process: ReturnType<typeof launch>) {
  return new Promise<string>((resolve, reject) => {
    const timer = setTimeout(() => {
      process.child.kill('SIGKILL');
      reject(new Error('Backend não iniciou a tempo'));
    }, 8000);
    const check = () => {
      const address = process
        .output()
        .match(/Server listening at (http:\/\/127\.0\.0\.1:\d+)/)?.[1];
      if (address) {
        clearTimeout(timer);
        resolve(address);
      }
    };
    process.child.stdout.on('data', check);
    process.exited.then(() => {
      clearTimeout(timer);
      reject(new Error('Backend encerrou antes de abrir a API'));
    }, reject);
    check();
  });
}
async function clean() {
  await client.query('DROP SCHEMA IF EXISTS drizzle CASCADE');
  await client.query('DROP SCHEMA public CASCADE');
  await client.query('CREATE SCHEMA public');
}
async function legacy() {
  await client.query(await readFile(resolve('tests/fixtures/legacy_initial.sql'), 'utf8'));
  await client.query(
    "CREATE TABLE schema_migrations (name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now()); INSERT INTO schema_migrations(name) VALUES ('0001_initial.sql')",
  );
}
async function catalog() {
  const columns = (
    await client.query(`SELECT c.relname, a.attname, format_type(a.atttypid,a.atttypmod), a.attnotnull, pg_get_expr(d.adbin,d.adrelid) AS default
    FROM pg_attribute a JOIN pg_class c ON c.oid=a.attrelid JOIN pg_namespace n ON n.oid=c.relnamespace
    LEFT JOIN pg_attrdef d ON d.adrelid=c.oid AND d.adnum=a.attnum
    WHERE n.nspname='public' AND c.relkind='r' AND a.attnum>0 AND NOT a.attisdropped ORDER BY c.relname,a.attname`)
  ).rows;
  const constraints = (
    await client.query(`SELECT t.relname, c.conname, c.convalidated, pg_get_constraintdef(c.oid) FROM pg_constraint c
    JOIN pg_class t ON t.oid=c.conrelid JOIN pg_namespace n ON n.oid=t.relnamespace
    WHERE n.nspname='public' ORDER BY t.relname,c.conname`)
  ).rows;
  const indexes = (
    await client.query(
      "SELECT tablename,indexname,indexdef FROM pg_indexes WHERE schemaname='public' ORDER BY tablename,indexname",
    )
  ).rows;
  return { columns, constraints, indexes };
}
async function copiedFolder() {
  const copy = await mkdtemp(join(tmpdir(), 'finances-migrations-'));
  temporary.push(copy);
  await cp(folder, copy, { recursive: true });
  return copy;
}
async function pending(copy: string, statements: string) {
  const path = join(copy, 'meta/_journal.json');
  const journal = JSON.parse(await readFile(path, 'utf8'));
  journal.entries.push({
    idx: 1,
    version: '7',
    when: journal.entries[0].when + 1,
    tag: '0001_probe',
    breakpoints: true,
  });
  await writeFile(path, JSON.stringify(journal));
  await writeFile(join(copy, '0001_probe.sql'), statements);
}
beforeAll(() => client.connect());
beforeEach(clean);
afterAll(async () => {
  try {
    await clean();
    await migrate(url!, folder);
    await Promise.all(temporary.map((p) => rm(p, { recursive: true, force: true })));
  } finally {
    await client.end();
  }
});
describe.sequential('Drizzle migrations and legacy adoption', () => {
  it('migrates at boot before serving HTTP and safely reapplies on restart from another working directory', async () => {
    for (let attempt = 0; attempt < 2; attempt++) {
      const process = launch();
      try {
        const address = await ready(process);
        expect((await fetch(`${address}/health/ready`)).status).toBe(200);
        expect(await (await fetch(`${address}/api/v1/auth/setup`)).json()).toEqual({
          configured: false,
        });
        expect(
          (await client.query('SELECT * FROM drizzle.__drizzle_migrations')).rows,
        ).toHaveLength(1);
      } finally {
        process.child.kill('SIGTERM');
        await process.exited;
      }
    }
  }, 20000);
  it('exits without serving HTTP when a pending migration fails during boot', async () => {
    await migrate(url!, folder);
    const copy = await copiedFolder();
    await pending(
      copy,
      'CREATE TABLE boot_probe (id integer);\n--> statement-breakpoint\nSELECT missing_boot_migration_function();',
    );
    const process = launch(copy);
    const timeout = setTimeout(() => process.child.kill('SIGKILL'), 8000);
    try {
      expect(await process.exited).toBe(1);
      expect(process.output()).not.toContain('Server listening');
      expect(
        (await client.query("SELECT to_regclass('public.boot_probe') AS probe")).rows[0].probe,
      ).toBeNull();
      expect((await client.query('SELECT * FROM drizzle.__drizzle_migrations')).rows).toHaveLength(
        1,
      );
    } finally {
      clearTimeout(timeout);
      if (process.child.exitCode === null) process.child.kill('SIGKILL');
      await process.exited;
    }
  }, 15000);
  it('creates the schema once under concurrent runners and preserves installation state', async () => {
    await Promise.all([migrate(url!, folder), migrate(url!, folder), migrate(url!, folder)]);
    expect((await client.query('SELECT * FROM drizzle.__drizzle_migrations')).rows).toHaveLength(1);
    expect((await client.query('SELECT * FROM installation')).rows).toEqual([
      { id: true, configured: false },
    ]);
    await client.query('UPDATE installation SET configured=true');
    await migrate(url!, folder);
    expect((await client.query('SELECT configured FROM installation')).rows[0].configured).toBe(
      true,
    );
  });
  it('produces the same columns, constraints and indexes as the released schema', async () => {
    await migrate(url!, folder);
    const fresh = await catalog();
    await clean();
    await legacy();
    await migrate(url!, folder);
    expect(await catalog()).toEqual(fresh);
    expect(
      (await client.query("SELECT to_regclass('public.schema_migrations') AS legacy")).rows[0]
        .legacy,
    ).toBeNull();
  });
  it('adopts the legacy database while preserving accounts, sessions, authorization and encrypted finances', async () => {
    await legacy();
    const { app, service } = await buildApp({
      DATABASE_URL: url!,
      MASTER_KEYS: JSON.stringify({ v1: randomBytes(32).toString('base64') }),
      ACTIVE_MASTER_KEY: 'v1',
      SETUP_TOKEN: 'migration-only-setup-token-for-finances',
      PUBLIC_URL: 'http://localhost:3000',
      NODE_ENV: 'test',
      PORT: 3000,
    });
    try {
      const registered = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/register',
        payload: {
          email: 'migration@example.test',
          name: 'Migration user',
          password: 'migration-fixture-password',
          setupToken: service.config.SETUP_TOKEN,
        },
      });
      expect(registered.statusCode, registered.body).toBe(201);
      const headers = {
        cookie: registered.cookies.map((c) => `${c.name}=${c.value}`).join('; '),
        'x-csrf-token': registered.json().csrf,
      };
      const spaces = (await app.inject({ url: '/api/v1/spaces', headers })).json();
      const path = `/api/v1/spaces/${spaces[0].id}`;
      const category = (await app.inject({ url: `${path}/categories`, headers })).json().items[0];
      const created = await app.inject({
        method: 'POST',
        url: `${path}/expenses`,
        headers,
        payload: {
          description: 'Preserved encrypted expense',
          amount: '27.43',
          categoryId: category.id,
          dueDate: '2026-10-01',
        },
      });
      expect(created.statusCode, created.body).toBe(201);
      const before = (await client.query('SELECT id,payload FROM records ORDER BY id')).rows;
      await Promise.all([migrate(url!, folder), migrate(url!, folder)]);
      expect((await client.query('SELECT id,payload FROM records ORDER BY id')).rows).toEqual(
        before,
      );
      expect((await app.inject({ url: '/api/v1/auth/me', headers })).statusCode).toBe(200);
      const fetched = await app.inject({ url: `${path}/expenses/${created.json().id}`, headers });
      expect(fetched.statusCode, fetched.body).toBe(200);
      expect(fetched.json().data.amount).toBe('27.43');
      expect((await client.query('SELECT configured FROM installation')).rows[0].configured).toBe(
        true,
      );
      expect((await client.query('SELECT count(*) FROM users')).rows[0].count).toBe('1');
    } finally {
      await app.close();
    }
  });
  it('applies subsequent migrations after adopting a legacy baseline', async () => {
    await legacy();
    const copy = await copiedFolder();
    await pending(copy, 'ALTER TABLE users ADD COLUMN migration_probe text;');
    await migrate(url!, copy);
    await migrate(url!, copy);
    expect((await client.query('SELECT * FROM drizzle.__drizzle_migrations')).rows).toHaveLength(2);
    expect(
      (
        await client.query(
          "SELECT column_name FROM information_schema.columns WHERE table_name='users' AND column_name='migration_probe'",
        )
      ).rows,
    ).toHaveLength(1);
  });
  it('rolls back a failed pending migration without recording it', async () => {
    await migrate(url!, folder);
    const copy = await copiedFolder();
    await pending(
      copy,
      'CREATE TABLE migration_probe (id integer);\n--> statement-breakpoint\nSELECT missing_migration_function();',
    );
    await expect(migrate(url!, copy)).rejects.toThrow();
    expect(
      (await client.query("SELECT to_regclass('public.migration_probe') AS probe")).rows[0].probe,
    ).toBeNull();
    expect((await client.query('SELECT * FROM drizzle.__drizzle_migrations')).rows).toHaveLength(1);
  });
  it('rejects changes to an already applied migration', async () => {
    await migrate(url!, folder);
    const copy = await copiedFolder();
    const original = await readFile(join(copy, '0000_initial.sql'), 'utf8');
    await writeFile(join(copy, '0000_initial.sql'), original + '\n-- altered applied migration\n');
    await expect(migrate(url!, copy)).rejects.toThrow('arquivo aplicado ausente ou alterado');
    expect((await client.query('SELECT * FROM drizzle.__drizzle_migrations')).rows).toHaveLength(1);
  });
  it.each([
    'DROP INDEX one_owner_per_space',
    'ALTER TABLE records DROP CONSTRAINT records_space_id_category_id_fkey',
    'ALTER TABLE users ADD COLUMN unexpected_column text',
  ])('rejects a divergent legacy schema: %s', async (statement) => {
    await legacy();
    await client.query(statement);
    await expect(migrate(url!, folder)).rejects.toThrow('Schema legado divergente');
    expect(
      (await client.query("SELECT to_regclass('drizzle.__drizzle_migrations') AS history")).rows[0]
        .history,
    ).toBeNull();
    expect((await client.query('SELECT name FROM schema_migrations')).rows).toEqual([
      { name: '0001_initial.sql' },
    ]);
  });
  it('refuses an unknown legacy history', async () => {
    await legacy();
    await client.query("INSERT INTO schema_migrations(name) VALUES ('unknown.sql')");
    await expect(migrate(url!, folder)).rejects.toThrow('Histórico SQL legado desconhecido');
    expect((await client.query('SELECT name FROM schema_migrations')).rows).toHaveLength(2);
  });
  it('rejects mixed migration histories after a legacy backup overwrites a migrated destination', async () => {
    await migrate(url!, folder);
    await client.query(
      "CREATE TABLE schema_migrations(name text PRIMARY KEY); INSERT INTO schema_migrations VALUES ('0001_initial.sql')",
    );
    await expect(migrate(url!, folder)).rejects.toThrow('Históricos SQL e Drizzle coexistem');
    expect((await client.query('SELECT * FROM drizzle.__drizzle_migrations')).rows).toHaveLength(1);
    expect((await client.query('SELECT * FROM schema_migrations')).rows).toHaveLength(1);
  });
});
