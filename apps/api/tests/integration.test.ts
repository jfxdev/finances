import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { randomBytes, randomUUID } from 'node:crypto';
import { resolve } from 'node:path';
import { eq, sql } from 'drizzle-orm';
import { buildApp } from '../src/app.js';
import { migrate } from '../src/migrate.js';
import { apiKeys, records, spaces, users } from '../src/db.js';
import { encrypt, decrypt } from '../src/crypto.js';
import { today } from '../src/domain.js';
import { createMcp } from '../src/mcp.js';
import { Service } from '../src/service.js';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import type {
  Entity,
  Transaction,
  Grant,
  Space,
  Resource,
  Investment,
  Recurrence,
} from '@finances/contracts';
const url = process.env.TEST_DATABASE_URL;
if (!url || !new URL(url).pathname.endsWith('_test'))
  throw new Error('TEST_DATABASE_URL deve apontar para um banco exclusivo terminado em _test');
let context: Awaited<ReturnType<typeof buildApp>>;
type Human = { id: string; cookie: string; csrf: string; admin: boolean; spaceId: string };
let admin: Human, alice: Human, bob: Human, group: string, category: string;
const date = today('America/Sao_Paulo');
const config = {
  DATABASE_URL: url,
  MASTER_KEYS: JSON.stringify({ v1: randomBytes(32).toString('base64') }),
  ACTIVE_MASTER_KEY: 'v1',
  SETUP_TOKEN: 'test-setup-token-for-finances-only',
  PUBLIC_URL: 'http://localhost:3000',
  PORT: 3000,
  NODE_ENV: 'test' as const,
};
async function call(
  who: Human | string | undefined,
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  path: string,
  payload?: unknown,
  extra: Record<string, string> = {},
) {
  return context.app.inject({
    method,
    url: `/api/v1${path}`,
    headers: {
      ...(typeof who === 'string'
        ? { authorization: `Bearer ${who}` }
        : who
          ? { cookie: who.cookie, 'x-csrf-token': who.csrf }
          : {}),
      ...extra,
    },
    ...(payload === undefined ? {} : { payload: payload as object }),
  });
}
async function register(email: string, setupToken?: string): Promise<Human> {
  const r = await call(undefined, 'POST', '/auth/register', {
    email,
    name: email.split('@')[0],
    password: 'a-strong-test-password',
    ...(setupToken ? { setupToken } : {}),
  });
  expect(r.statusCode, r.body).toBe(201);
  const d = r.json();
  const h = {
    id: d.user.id,
    admin: d.user.admin,
    csrf: d.csrf,
    cookie: r.cookies.map((c) => `${c.name}=${c.value}`).join('; '),
    spaceId: '',
  };
  const s = await call(h, 'GET', '/spaces');
  h.spaceId = s.json()[0].id;
  return h;
}
async function invite(who: Human, role: 'reader' | 'editor') {
  const r = await call(admin, 'POST', `/spaces/${group}/invites`, { role });
  expect(r.statusCode, r.body).toBe(200);
  const accept = await call(who, 'POST', '/invites/accept', { token: r.json().url.split('#')[1] });
  expect(accept.statusCode, accept.body).toBe(200);
  return r.json().url.split('#')[1] as string;
}
async function key(who: Human, grants: Grant[], expiresAt?: string) {
  const r = await call(who, 'POST', '/keys', {
    name: 'Test agent',
    grants,
    expiresAt: expiresAt ?? null,
  });
  expect(r.statusCode, r.body).toBe(201);
  return r.json() as { id: string; secret: string };
}
const txData = (cat = category): Transaction => ({
  description: 'Private Netflix subscription',
  amount: '42.90',
  categoryId: cat,
  dueDate: date,
  status: 'pending',
  effectiveDate: null,
  notes: 'Never log this note',
});
beforeAll(async () => {
  await migrate(url!, resolve('migrations'));
  context = await buildApp(config);
  await context.pool.query(
    'TRUNCATE users,spaces,members,records,sessions,api_keys,invites,resets,audits,idempotencies CASCADE',
  );
  await context.pool.query('UPDATE installation SET configured=false');
  await context.app.ready();
}, 30000);
afterAll(async () => {
  await context?.app.close();
});
describe.sequential('complete PostgreSQL integration', () => {
  it('requires a setup token and serializes initial administrator creation', async () => {
    expect(
      (
        await call(undefined, 'POST', '/auth/register', {
          email: 'invalid@example.test',
          name: 'Invalid',
          password: 'a-strong-test-password',
        })
      ).statusCode,
    ).toBe(403);
    const people = await Promise.all([
      register('admin@example.test', config.SETUP_TOKEN),
      register('alice@example.test', config.SETUP_TOKEN),
    ]);
    admin = people.find((p) => p.admin)!;
    alice = people.find((p) => !p.admin)!;
    expect(people.filter((p) => p.admin)).toHaveLength(1);
    bob = await register('bob@example.test');
    expect(bob.admin).toBe(false);
    const r = await call(admin, 'POST', '/spaces', {
      name: 'Family',
      currency: 'BRL',
      timezone: 'America/Sao_Paulo',
    });
    expect(r.statusCode, r.body).toBe(201);
    group = r.json().id;
    const cats = await call(admin, 'GET', `/spaces/${group}/categories`);
    category = cats
      .json()
      .items.find((c: Entity<'categories'>) => c.data.name === 'Assinaturas').id;
  });
  it('isolates personal spaces even from the installation administrator', async () => {
    const r = await call(admin, 'GET', `/spaces/${alice.spaceId}/expenses`);
    expect(r.statusCode).toBe(404);
    expect((await call(alice, 'GET', `/spaces/${admin.spaceId}/categories`)).statusCode).toBe(404);
  });
  it('requires CSRF and rejects foreign origins', async () => {
    const r = await context.app.inject({
      method: 'POST',
      url: '/api/v1/spaces',
      headers: { cookie: admin.cookie },
      payload: { name: 'No CSRF' },
    });
    expect(r.statusCode).toBe(403);
    expect(
      (
        await call(
          admin,
          'POST',
          '/spaces',
          { name: 'No origin' },
          { origin: 'https://evil.example' },
        )
      ).statusCode,
    ).toBe(403);
  });
  it('accepts the configured local frontend and backend origins only in development', async () => {
    const { app } = await buildApp({
      ...config,
      NODE_ENV: 'development',
      PUBLIC_URL: 'http://localhost:5173',
    });
    try {
      for (const origin of [
        'http://localhost:3000',
        'http://localhost:5173',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:5173',
        'http://[::1]:3000',
      ]) {
        const response = await app.inject({
          method: 'POST',
          url: '/api/v1/auth/login',
          headers: { origin },
          payload: {},
        });
        expect(response.statusCode, response.body).toBe(400);
        expect(response.json().error.code).toBe('VALIDATION_ERROR');
        const mcp = await app.inject({
          method: 'POST',
          url: '/mcp',
          headers: { origin, host: new URL(origin).host },
          payload: {},
        });
        expect(mcp.statusCode, mcp.body).toBe(401);
        expect(mcp.json().error.code).toBe('KEY_REQUIRED');
      }
      for (const origin of [
        'http://localhost:9999',
        'http://localhost.evil.example:3000',
        'http://evil.example:5173',
        'null',
      ]) {
        const response = await app.inject({
          method: 'POST',
          url: '/api/v1/auth/login',
          headers: { origin },
          payload: {},
        });
        expect(response.statusCode, response.body).toBe(403);
        expect(response.json().error.code).toBe('INVALID_ORIGIN');
      }
      const csrf = await app.inject({
        method: 'POST',
        url: '/api/v1/spaces',
        headers: { origin: 'http://localhost:3000', cookie: admin.cookie },
        payload: { name: 'Missing CSRF' },
      });
      expect(csrf.statusCode, csrf.body).toBe(403);
      expect(csrf.json().error.code).toBe('CSRF_INVALID');
    } finally {
      await app.close();
    }
  });
  it('keeps production restricted to PUBLIC_URL for REST and MCP', async () => {
    const { app } = await buildApp({
      ...config,
      NODE_ENV: 'production',
      PUBLIC_URL: 'https://finances.example.test',
    });
    try {
      for (const origin of [
        'http://localhost:3000',
        'http://127.0.0.1:5173',
        'https://evil.example.test',
      ]) {
        const response = await app.inject({
          method: 'POST',
          url: '/api/v1/auth/login',
          headers: { origin },
          payload: {},
        });
        expect(response.statusCode, response.body).toBe(403);
        expect(response.json().error.code).toBe('INVALID_ORIGIN');
      }
      const valid = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/login',
        headers: { origin: 'https://finances.example.test' },
        payload: {},
      });
      expect(valid.json().error.code).toBe('VALIDATION_ERROR');
      const badHost = await app.inject({
        method: 'POST',
        url: '/mcp',
        headers: { host: 'localhost:3000' },
        payload: {},
      });
      expect(badHost.json().error.code).toBe('INVALID_HOST');
    } finally {
      await app.close();
    }
  });
  it('grants editors and readers and makes invitations single-use', async () => {
    const token = await invite(alice, 'editor');
    await invite(bob, 'reader');
    expect((await call(bob, 'POST', '/invites/accept', { token })).statusCode).toBe(400);
    expect((await call(bob, 'POST', `/spaces/${group}/expenses`, txData())).statusCode).toBe(403);
    expect((await call(alice, 'POST', `/spaces/${group}/expenses`, txData())).statusCode).toBe(201);
  });
  it('registers users publicly and shares a personal space only after explicit owner consent and invitation acceptance', async () => {
    const owner = await register('sharing-owner@example.test');
    const guest = await register('sharing-guest@example.test');
    expect(owner.admin).toBe(false);
    expect(guest.admin).toBe(false);
    const personal = (await call(owner, 'GET', '/spaces')).json()[0] as Space;
    expect(personal.personal).toBe(true);
    expect((await call(guest, 'GET', `/spaces/${personal.id}/members`)).statusCode).toBe(404);
    const categories = (await call(owner, 'GET', `/spaces/${personal.id}/categories`)).json().items;
    const created = await call(
      owner,
      'POST',
      `/spaces/${personal.id}/expenses`,
      txData(categories[0].id),
    );
    expect(created.statusCode, created.body).toBe(201);
    const record = created.json() as Entity<'expenses'>;
    const refused = await call(owner, 'POST', `/spaces/${personal.id}/invites`, { role: 'reader' });
    expect(refused.statusCode).toBe(400);
    expect(refused.json().error.code).toBe('PERSONAL_SPACE');
    expect((await call(owner, 'GET', '/spaces')).json()[0].personal).toBe(true);
    const invited = await call(owner, 'POST', `/spaces/${personal.id}/invites`, {
      role: 'reader',
      sharePersonal: true,
    });
    expect(invited.statusCode, invited.body).toBe(200);
    const token = invited.json().url.split('#')[1];
    expect(
      (await call(guest, 'GET', `/spaces/${personal.id}/expenses/${record.id}`)).statusCode,
    ).toBe(404);
    expect((await call(undefined, 'POST', '/invites/accept', { token })).statusCode).toBe(401);
    const accepted = await call(guest, 'POST', '/invites/accept', { token });
    expect(accepted.statusCode, accepted.body).toBe(200);
    const shared = (await call(guest, 'GET', '/spaces'))
      .json()
      .find((s: Space) => s.id === personal.id);
    expect(shared).toMatchObject({
      personal: false,
      role: 'reader',
      version: personal.version + 1,
    });
    expect(
      (await call(guest, 'GET', `/spaces/${personal.id}/expenses/${record.id}`)).json(),
    ).toEqual(record);
    expect(
      (await call(guest, 'POST', `/spaces/${personal.id}/expenses`, txData(categories[0].id)))
        .statusCode,
    ).toBe(403);
    expect(
      (await call(guest, 'POST', `/spaces/${personal.id}/invites`, { role: 'editor' })).statusCode,
    ).toBe(403);
    expect((await call(guest, 'POST', '/invites/accept', { token })).statusCode).toBe(400);
    const ownSpace = (await call(guest, 'GET', '/spaces'))
      .json()
      .find((s: Space) => s.id === guest.spaceId);
    expect(ownSpace).toMatchObject({ personal: true, role: 'owner' });
  });
  it('rejects references to categories in other spaces', async () => {
    const cats = (await call(alice, 'GET', `/spaces/${alice.spaceId}/categories`)).json().items;
    expect(
      (await call(admin, 'POST', `/spaces/${group}/expenses`, txData(cats[0].id))).statusCode,
    ).toBe(404);
  });
  it('implements exact money, idempotency and optimistic concurrency', async () => {
    const idempotency = randomUUID();
    const [a, b] = await Promise.all([
      call(admin, 'POST', `/spaces/${group}/expenses`, txData(), {
        'idempotency-key': idempotency,
      }),
      call(admin, 'POST', `/spaces/${group}/expenses`, txData(), {
        'idempotency-key': idempotency,
      }),
    ]);
    expect(a.statusCode, a.body).toBe(201);
    expect(b.statusCode, b.body).toBe(201);
    expect(a.json().id).toBe(b.json().id);
    expect(
      (
        await call(
          admin,
          'POST',
          `/spaces/${group}/expenses`,
          { ...txData(), amount: '43' },
          { 'idempotency-key': idempotency },
        )
      ).statusCode,
    ).toBe(409);
    const e = a.json() as Entity<'expenses'>;
    const update = await call(admin, 'PATCH', `/spaces/${group}/expenses/${e.id}`, {
      version: e.version,
      data: { ...e.data, status: 'confirmed', effectiveDate: date, amount: '0.10' },
    });
    expect(update.statusCode, update.body).toBe(200);
    expect(
      (
        await call(admin, 'PATCH', `/spaces/${group}/expenses/${e.id}`, {
          version: e.version,
          data: e.data,
        })
      ).statusCode,
    ).toBe(409);
    expect(
      (await call(admin, 'DELETE', `/spaces/${group}/expenses/${e.id}`, { version: e.version }))
        .statusCode,
    ).toBe(409);
    expect(
      (
        await call(admin, 'POST', `/spaces/${group}/expenses`, {
          ...txData(),
          status: 'confirmed',
          effectiveDate: date,
          amount: '0.20',
        })
      ).statusCode,
    ).toBe(201);
    const summary = (
      await call(admin, 'GET', `/spaces/${group}/summary?month=${date.slice(0, 7)}`)
    ).json();
    expect(summary.expenses).toBe('0.30');
    expect(summary.balance).toBe('-0.30');
  });
  it('locks currency after the first financial record and handles currency scales', async () => {
    const space = (await call(admin, 'GET', '/spaces')).json().find((s: Space) => s.id === group);
    expect(
      (
        await call(admin, 'PATCH', `/spaces/${group}`, {
          name: 'Family',
          currency: 'USD',
          timezone: space.timezone,
          version: space.version,
        })
      ).statusCode,
    ).toBe(409);
    const r = await call(admin, 'POST', '/spaces', { name: 'Yen', currency: 'JPY' });
    const id = r.json().id;
    const c = (await call(admin, 'GET', `/spaces/${id}/categories`)).json().items[0].id;
    expect(
      (await call(admin, 'POST', `/spaces/${id}/expenses`, { ...txData(c), amount: '1.01' }))
        .statusCode,
    ).toBe(400);
  });
  it('uses encrypted payloads and does not expose credentials or financial text in storage and audit', async () => {
    const raw = await context.pool.query('SELECT payload FROM records WHERE space_id=$1', [group]);
    const text = JSON.stringify(raw.rows);
    expect(text).not.toContain('Private Netflix');
    expect(text).not.toContain('Never log');
    expect(text).not.toContain('42.90');
    const audit = await context.pool.query('SELECT * FROM audits');
    expect(JSON.stringify(audit.rows)).not.toContain('Private Netflix');
    const [u] = await context.service.db.select().from(users).where(eq(users.id, admin.id));
    expect(u.passwordHash).toMatch(/^\$argon2id\$/);
  });
  it('scopes API keys per resource and space, and limits summaries', async () => {
    const k = await key(alice, [
      { spaceId: group, resource: 'expenses', operations: ['read', 'create'] },
    ]);
    expect((await call(k.secret, 'GET', `/spaces/${group}/expenses`)).statusCode).toBe(200);
    expect((await call(k.secret, 'GET', `/spaces/${group}/incomes`)).statusCode).toBe(403);
    expect((await call(k.secret, 'GET', `/spaces/${alice.spaceId}/expenses`)).statusCode).toBe(403);
    expect((await call(k.secret, 'POST', `/spaces/${group}/expenses`, txData())).statusCode).toBe(
      201,
    );
    const sum = (
      await call(k.secret, 'GET', `/spaces/${group}/summary?month=${date.slice(0, 7)}`)
    ).json();
    expect(sum.incomes).toBeNull();
    expect(sum.balance).toBeNull();
    expect(sum.byCategory[0].name).toBe('Categoria');
    expect((await call(k.secret, 'GET', '/admin/users')).statusCode).toBe(403);
    expect(
      (await call(k.secret, 'POST', `/spaces/${group}/invites`, { role: 'reader' })).statusCode,
    ).toBe(403);
    const stored = (await context.service.db.select().from(apiKeys).where(eq(apiKeys.id, k.id)))[0];
    expect(JSON.stringify(stored)).not.toContain(k.secret);
    expect((await call(alice, 'DELETE', `/keys/${k.id}`)).statusCode).toBe(200);
    expect((await call(k.secret, 'GET', `/spaces/${group}/expenses`)).statusCode).toBe(401);
  });
  it('does not let readers create write keys and immediately enforces membership changes', async () => {
    expect(
      (
        await call(bob, 'POST', '/keys', {
          name: 'Escalation',
          grants: [{ spaceId: group, resource: 'expenses', operations: ['create'] }],
        })
      ).statusCode,
    ).toBe(403);
    const k = await key(alice, [
      { spaceId: group, resource: 'expenses', operations: ['create', 'read'] },
    ]);
    expect(
      (await call(admin, 'PATCH', `/spaces/${group}/members/${alice.id}`, { role: 'reader' }))
        .statusCode,
    ).toBe(200);
    expect((await call(k.secret, 'POST', `/spaces/${group}/expenses`, txData())).statusCode).toBe(
      403,
    );
    await call(admin, 'PATCH', `/spaces/${group}/members/${alice.id}`, { role: 'editor' });
    await call(admin, 'DELETE', `/spaces/${group}/members/${alice.id}`);
    expect((await call(k.secret, 'GET', `/spaces/${group}/expenses`)).statusCode).toBe(404);
    await invite(alice, 'editor');
  });
  it('archives used categories and preserves historical references', async () => {
    const e = (await call(admin, 'GET', `/spaces/${group}/categories/${category}`)).json();
    const r = await call(admin, 'DELETE', `/spaces/${group}/categories/${category}`, {
      version: e.version,
    });
    expect(r.json().archived).toBe(true);
    expect((await call(admin, 'POST', `/spaces/${group}/expenses`, txData())).statusCode).toBe(400);
    const current = (await call(admin, 'GET', `/spaces/${group}/categories/${category}`)).json();
    await call(admin, 'PATCH', `/spaces/${group}/categories/${category}`, {
      version: current.version,
      data: { ...current.data, archived: false },
    });
  });
  it('generates occurrences once across concurrent workers and preserves cancellations after restarts', async () => {
    const body = {
      description: 'ChatGPT',
      amount: '100',
      categoryId: category,
      type: 'expense',
      frequency: 'monthly',
      interval: 1,
      startDate: date,
      paused: false,
    };
    const result = await call(admin, 'POST', `/spaces/${group}/recurrences`, body);
    expect(result.statusCode, result.body).toBe(201);
    const recurrence = result.json() as Entity<'recurrences'>;
    await Promise.all([context.service.generate(), context.service.generate()]);
    const rows = (await call(admin, 'GET', `/spaces/${group}/expenses?limit=100`))
      .json()
      .items.filter((e: Entity) => e.recurrenceId === recurrence.id);
    expect(rows.length).toBeGreaterThan(0);
    const row = rows[0];
    await call(admin, 'PATCH', `/spaces/${group}/expenses/${row.id}`, {
      version: row.version,
      data: { ...row.data, status: 'cancelled' },
    });
    await context.service.generate();
    const current = (await call(admin, 'GET', `/spaces/${group}/expenses/${row.id}`)).json();
    expect(current.data.status).toBe('cancelled');
    expect(
      (
        await context.pool.query(
          'SELECT occurrence_date,count(*) FROM records WHERE recurrence_id=$1 GROUP BY occurrence_date HAVING count(*)>1',
          [recurrence.id],
        )
      ).rows,
    ).toHaveLength(0);
  });
  it.each(['incomes', 'expenses'] as const)(
    'rejects a separate confirmed %s record matching a pending recurrence',
    async (resource) => {
      const created = await call(admin, 'POST', `/spaces/${group}/recurrences`, {
        description: `Recurring ${resource}`,
        amount: '1234.50',
        categoryId: category,
        type: resource === 'incomes' ? 'income' : 'expense',
        frequency: 'monthly',
        startDate: date,
      });
      expect(created.statusCode, created.body).toBe(201);
      const recurrence = created.json() as Entity<'recurrences'>;
      const confirmed = {
        description: recurrence.data.description,
        amount: '1234.5',
        categoryId: category,
        dueDate: date,
        status: 'confirmed',
        effectiveDate: date,
      };
      const duplicate = await call(admin, 'POST', `/spaces/${group}/${resource}`, confirmed);
      expect(duplicate.statusCode, duplicate.body).toBe(409);
      expect(duplicate.json().error.code).toBe('PENDING_RECURRENCE_EXISTS');
      const page = (await call(admin, 'GET', `/spaces/${group}/${resource}?limit=100`)).json();
      const original = page.items.find(
        (e: Entity<'incomes'>) => e.recurrenceId === recurrence.id && e.data.dueDate === date,
      );
      expect(original.data.status).toBe('pending');
      expect(
        page.items.filter(
          (e: Entity<'incomes'>) =>
            e.data.description === confirmed.description && e.data.dueDate === date,
        ),
      ).toHaveLength(1);
      for (const variation of [
        { amount: '1234.51' },
        { description: `Additional ${resource}` },
        {
          dueDate:
            `${date.slice(0, 4)}-01-01` === date
              ? `${date.slice(0, 4)}-01-02`
              : `${date.slice(0, 4)}-01-01`,
        },
      ])
        expect(
          (
            await call(admin, 'POST', `/spaces/${group}/${resource}`, {
              ...confirmed,
              ...variation,
            })
          ).statusCode,
        ).toBe(201);
      const updated = await call(admin, 'PATCH', `/spaces/${group}/${resource}/${original.id}`, {
        version: original.version,
        data: { ...original.data, status: 'confirmed', effectiveDate: date },
      });
      expect(updated.statusCode, updated.body).toBe(200);
      expect(updated.json().recurrenceId).toBe(recurrence.id);
    },
  );
  it('preserves confirmed and deleted monthly occurrences when a restarted worker rescans the series', async () => {
    const created = await call(admin, 'POST', `/spaces/${group}/recurrences`, {
      description: 'Restart salary',
      amount: '3000',
      categoryId: category,
      type: 'income',
      frequency: 'monthly',
      startDate: `${date.slice(0, 7)}-01`,
    });
    expect(created.statusCode, created.body).toBe(201);
    const recurrence = created.json() as Entity<'recurrences'>;
    const occurrences = (await call(admin, 'GET', `/spaces/${group}/incomes?limit=100`))
      .json()
      .items.filter((e: Entity) => e.recurrenceId === recurrence.id) as Entity<'incomes'>[];
    expect(occurrences).toHaveLength(2);
    const current = occurrences.find((e) => e.data.dueDate === recurrence.data.startDate)!;
    const future = occurrences.find((e) => e.id !== current.id)!;
    expect(
      (
        await call(admin, 'PATCH', `/spaces/${group}/incomes/${current.id}`, {
          version: current.version,
          data: { ...current.data, status: 'confirmed', effectiveDate: date },
        })
      ).statusCode,
    ).toBe(200);
    expect(
      (
        await call(admin, 'DELETE', `/spaces/${group}/incomes/${future.id}`, {
          version: future.version,
        })
      ).statusCode,
    ).toBe(200);
    // Force a full rescan to verify persistent occurrence markers, independently of the cursor.
    const [space] = await context.service.db.select().from(spaces).where(eq(spaces.id, group));
    const [row] = await context.service.db
      .select()
      .from(records)
      .where(eq(records.id, recurrence.id));
    await context.service.db
      .update(records)
      .set({
        payload: encrypt(context.service.key(space), `record:${group}:recurrences:${row.id}`, {
          ...context.service.data(row, space),
          generatedThrough: recurrence.data.startDate,
        }),
      })
      .where(eq(records.id, row.id));
    const restarted = new Service(context.service.db, config);
    await Promise.all([restarted.generate(), context.service.generate()]);
    const remaining = (await call(admin, 'GET', `/spaces/${group}/incomes?limit=100`))
      .json()
      .items.filter((e: Entity) => e.recurrenceId === recurrence.id);
    expect(remaining).toHaveLength(1);
    expect(remaining[0]).toMatchObject({
      id: current.id,
      data: { status: 'confirmed', effectiveDate: date },
    });
    expect((await call(admin, 'GET', `/spaces/${group}/incomes/${future.id}`)).statusCode).toBe(
      404,
    );
    // An explicitly deleted occurrence does not block an independent replacement.
    expect(
      (
        await call(admin, 'POST', `/spaces/${group}/incomes`, {
          ...future.data,
          status: 'confirmed',
          effectiveDate: date,
        })
      ).statusCode,
    ).toBe(201);
  });
  it('edits only pending series occurrences and preserves confirmed ones', async () => {
    const created = await call(admin, 'POST', `/spaces/${group}/recurrences`, {
      description: 'Salary',
      amount: '1000',
      categoryId: category,
      type: 'income',
      frequency: 'daily',
      startDate: date,
    });
    expect(created.statusCode, created.body).toBe(201);
    let r = created.json() as Entity<'recurrences'>;
    const page = (await call(admin, 'GET', `/spaces/${group}/incomes?limit=100`)).json()
      .items as Entity<'incomes'>[];
    const first = page.find((e) => e.recurrenceId === r.id && e.data.dueDate === date)!;
    await call(admin, 'PATCH', `/spaces/${group}/incomes/${first.id}`, {
      version: first.version,
      data: { ...first.data, status: 'confirmed', effectiveDate: date },
    });
    const changed = await call(admin, 'PATCH', `/spaces/${group}/recurrences/${r.id}`, {
      version: r.version,
      effectiveFrom: date,
      data: { ...r.data, amount: '2000' },
    });
    expect(changed.statusCode, changed.body).toBe(200);
    r = changed.json();
    expect(
      (await call(admin, 'GET', `/spaces/${group}/incomes/${first.id}`)).json().data.amount,
    ).toBe('1000');
    const other = (await call(admin, 'GET', `/spaces/${group}/incomes?limit=100`))
      .json()
      .items.find((e: Entity<'incomes'>) => e.recurrenceId === r.id && e.data.status === 'pending');
    expect(other.data.amount).toBe('2000');
    const pendingBefore = (
      await call(admin, 'GET', `/spaces/${group}/incomes?status=pending&limit=100`)
    ).json().total;
    const paused = await call(admin, 'PATCH', `/spaces/${group}/recurrences/${r.id}`, {
      version: r.version,
      data: { ...r.data, paused: true },
      effectiveFrom: date,
    });
    expect(paused.statusCode).toBe(200);
    expect(
      (await call(admin, 'GET', `/spaces/${group}/incomes?status=pending&limit=100`)).json().total,
    ).toBe(pendingBefore);
    expect(
      (await call(admin, 'GET', `/spaces/${group}/incomes/${first.id}`)).json().data.status,
    ).toBe('confirmed');
  });
  it('computes investment evolution without duplicating income and rejects over-withdrawals', async () => {
    const r = await call(admin, 'POST', `/spaces/${group}/investments`, {
      name: 'Emergency savings',
      type: 'savings',
      initialBalance: '100',
      startDate: date,
      goal: '500',
    });
    expect(r.statusCode, r.body).toBe(201);
    const id = r.json().id;
    expect(
      (
        await call(admin, 'POST', `/spaces/${group}/movements`, {
          investmentId: id,
          type: 'deposit',
          amount: '50',
          date,
        })
      ).statusCode,
    ).toBe(201);
    const before = (
      await call(admin, 'GET', `/spaces/${group}/summary?month=${date.slice(0, 7)}`)
    ).json();
    expect(
      (
        await call(admin, 'POST', `/spaces/${group}/valuations`, {
          investmentId: id,
          amount: '160',
          date,
        })
      ).statusCode,
    ).toBe(201);
    const report = (await call(admin, 'GET', `/spaces/${group}/investments/${id}/report`)).json();
    expect(report).toMatchObject({
      current: '160.00',
      deposits: '150.00',
      result: '10.00',
      progress: 32,
    });
    expect(report.history.length).toBeGreaterThan(0);
    expect(
      (await call(admin, 'GET', `/spaces/${group}/summary?month=${date.slice(0, 7)}`)).json()
        .incomes,
    ).toBe(before.incomes);
    expect(
      (
        await call(admin, 'POST', `/spaces/${group}/movements`, {
          investmentId: id,
          type: 'withdrawal',
          amount: '999',
          date: new Date(+new Date(date + 'T12:00:00Z') + 86400000).toISOString().slice(0, 10),
        })
      ).statusCode,
    ).toBe(400);
    expect(
      (
        await call(admin, 'POST', `/spaces/${group}/valuations`, {
          investmentId: id,
          amount: '161',
          date,
        })
      ).statusCode,
    ).toBe(409);
    const k = await key(admin, [{ spaceId: group, resource: 'investments', operations: ['read'] }]);
    expect(
      (await call(k.secret, 'GET', `/spaces/${group}/investments/${id}/report`)).statusCode,
    ).toBe(403);
  });
  it('keeps investment entries immutable, cumulative and idempotent with weekly projections', async () => {
    const investment = (
      await call(admin, 'POST', `/spaces/${group}/investments`, {
        name: 'CDB projection',
        type: 'investment',
        product: 'cdb',
        initialBalance: '1000',
        startDate: '2026-01-01',
        maturityDate: '2027-01-01',
        expectedAnnualReturn: 10,
        taxable: true,
        taxRate: 20,
      })
    ).json() as Entity<'investments'>;
    const path = `/spaces/${group}`;
    const payload = {
      investmentId: investment.id,
      type: 'deposit',
      amount: '100',
      date: '2026-01-01',
    };
    const token = randomUUID();
    const responses = await Promise.all([
      call(admin, 'POST', `${path}/movements`, payload, { 'idempotency-key': token }),
      call(admin, 'POST', `${path}/movements`, payload, { 'idempotency-key': token }),
    ]);
    expect(responses[0].statusCode, responses[0].body).toBe(201);
    expect(responses[1].statusCode, responses[1].body).toBe(201);
    const movement = responses[0].json();
    expect(responses[1].json().id).toBe(movement.id);
    const valuation = (
      await call(admin, 'POST', `${path}/valuations`, {
        investmentId: investment.id,
        amount: '1100',
        date: '2026-01-01',
      })
    ).json();
    for (const entry of [movement, valuation]) {
      const entryPath = `${path}/${entry.resource}/${entry.id}`;
      const update = await call(admin, 'PATCH', entryPath, {
        data: { ...entry.data, amount: '1' },
        version: entry.version,
      });
      expect(update.statusCode, update.body).toBe(409);
      expect(update.json().error.code).toBe('IMMUTABLE_INVESTMENT_ENTRY');
      const removed = await call(admin, 'DELETE', entryPath, { version: entry.version });
      expect(removed.statusCode, removed.body).toBe(409);
      expect((await call(admin, 'GET', entryPath)).json().data.amount).toBe(entry.data.amount);
    }
    expect(
      (
        await call(admin, 'DELETE', `${path}/investments/${investment.id}`, {
          version: investment.version,
        })
      ).statusCode,
    ).toBe(409);
    const changedPrincipal = await call(admin, 'PATCH', `${path}/investments/${investment.id}`, {
      data: { ...investment.data, initialBalance: '1' },
      version: investment.version,
    });
    expect(changedPrincipal.json().error.code).toBe('IMMUTABLE_PRINCIPAL');
    expect(
      (
        await call(admin, 'PATCH', `${path}/investments/${investment.id}`, {
          data: { ...investment.data, startDate: '2025-12-01' },
          version: investment.version,
        })
      ).json().error.code,
    ).toBe('IMMUTABLE_PRINCIPAL');
    const report = (await call(admin, 'GET', `${path}/investments/${investment.id}/report`)).json();
    expect(report).toMatchObject({
      current: '1100.00',
      deposits: '1100.00',
      projection: {
        gross: '1210.00',
        earnings: '110.00',
        tax: '22.00',
        net: '1188.00',
        maturityDate: '2027-01-01',
      },
    });
    expect(report.forecast[1].date).toBe('2026-01-08');
    expect(report.forecast.at(-1).date).toBe('2027-01-01');
    expect(
      (await call(admin, 'POST', `${path}/movements`, { ...payload, date: '2027-01-02' }))
        .statusCode,
    ).toBe(201);
    expect(
      (await call(admin, 'GET', `${path}/investments/${investment.id}/report`)).json().projection,
    ).toEqual(report.projection);
    const correction = await call(admin, 'POST', `${path}/movements`, {
      ...payload,
      type: 'withdrawal',
      amount: '20',
      date: '2026-01-02',
    });
    expect(correction.statusCode).toBe(201);
    expect(
      (await call(admin, 'GET', `${path}/investments/${investment.id}/report`)).json().current,
    ).toBe('1080.00');
    const metadata = await call(admin, 'PATCH', `${path}/investments/${investment.id}`, {
      data: { ...investment.data, name: 'Updated name' },
      version: investment.version,
    });
    expect(metadata.statusCode, metadata.body).toBe(200);
    const k = await key(admin, [
      { spaceId: group, resource: 'movements', operations: ['read', 'update', 'delete'] },
    ]);
    expect(
      (
        await call(k.secret, 'DELETE', `${path}/movements/${movement.id}`, {
          version: movement.version,
        })
      ).json().error.code,
    ).toBe('IMMUTABLE_INVESTMENT_ENTRY');
    const server = createMcp(context.service, { userId: admin.id, keyId: k.id }, async () => []);
    const client = new Client({ name: 'immutable-investment', version: '1' });
    const [a, b] = InMemoryTransport.createLinkedPair();
    await server.connect(a);
    await client.connect(b);
    try {
      const removed = await client.callTool({
        name: 'delete_movements',
        arguments: { spaceId: group, id: movement.id, version: movement.version },
      });
      expect(removed.isError).toBe(true);
      expect((removed.content as { text: string }[])[0].text).toContain(
        'IMMUTABLE_INVESTMENT_ENTRY',
      );
    } finally {
      await client.close();
      await server.close();
    }
  });
  it('exposes identical authorization, idempotency and version checks through MCP tools', async () => {
    const k = await key(alice, [
      { spaceId: group, resource: 'expenses', operations: ['read', 'create', 'update', 'delete'] },
    ]);
    const server = createMcp(context.service, { userId: alice.id, keyId: k.id }, async () => []);
    const client = new Client({ name: 'integration', version: '1' });
    const [a, b] = InMemoryTransport.createLinkedPair();
    await server.connect(a);
    await client.connect(b);
    try {
      const tools = await client.listTools();
      expect(
        tools.tools.find((t) => t.name === 'delete_expenses')?.annotations?.destructiveHint,
      ).toBe(true);
      const idempotencyKey = randomUUID();
      const args = { spaceId: group, data: txData(), idempotencyKey };
      const created = await client.callTool({ name: 'create_expenses', arguments: args });
      expect(created.isError).not.toBe(true);
      const text = (created.content as { type: string; text: string }[])[0].text;
      const entity = JSON.parse(text) as Entity<'expenses'>;
      const duplicate = await client.callTool({ name: 'create_expenses', arguments: args });
      expect(JSON.parse((duplicate.content as { text: string }[])[0].text).id).toBe(entity.id);
      const forbidden = await client.callTool({
        name: 'list_incomes',
        arguments: { spaceId: group },
      });
      expect(forbidden.isError).toBe(true);
      const stale = await client.callTool({
        name: 'update_expenses',
        arguments: { spaceId: group, id: entity.id, version: 999, data: entity.data },
      });
      expect(stale.isError).toBe(true);
      expect((stale.content as { text: string }[])[0].text).toContain('VERSION_CONFLICT');
      await call(alice, 'DELETE', `/keys/${k.id}`);
      expect(
        (await client.callTool({ name: 'list_expenses', arguments: { spaceId: group } })).isError,
      ).toBe(true);
    } finally {
      await client.close();
      await server.close();
    }
  });
  it('protects the remote MCP endpoint against missing keys and foreign hosts', async () => {
    expect(
      (
        await context.app.inject({
          method: 'POST',
          url: '/mcp',
          headers: { host: 'evil.example' },
          payload: {},
        })
      ).statusCode,
    ).toBe(400);
    expect(
      (
        await context.app.inject({
          method: 'POST',
          url: '/mcp',
          headers: { host: 'localhost:3000' },
          payload: {},
        })
      ).statusCode,
    ).toBe(401);
    expect((await context.app.inject({ method: 'GET', url: '/mcp' })).statusCode).toBe(405);
  });
  it('rotates wrapped space keys without changing encrypted financial records', async () => {
    const [space] = await context.service.db.select().from(spaces).where(eq(spaces.id, group));
    const old = space.wrappedKey;
    const raw = await context.pool.query('SELECT payload FROM records WHERE space_id=$1 LIMIT 1', [
      group,
    ]);
    const key = context.service.key(space);
    const next = randomBytes(32);
    context.service.masterKeys.v2 = next;
    await context.service.db
      .update(spaces)
      .set({
        wrappedKey: encrypt(next, `space-key:${group}`, key.toString('base64')),
        keyVersion: 'v2',
      })
      .where(eq(spaces.id, group));
    expect((await call(admin, 'GET', `/spaces/${group}/expenses`)).statusCode).toBe(200);
    expect(
      (await context.pool.query('SELECT payload FROM records WHERE space_id=$1 LIMIT 1', [group]))
        .rows,
    ).toEqual(raw.rows);
    expect(() => decrypt(next, `space-key:${group}`, old)).toThrow();
    await context.service.db
      .update(spaces)
      .set({ wrappedKey: old, keyVersion: 'v1' })
      .where(eq(spaces.id, group));
  });
  it('revokes sessions and keys on password reset, and consumes links once', async () => {
    const k = await key(bob, [{ spaceId: group, resource: 'expenses', operations: ['read'] }]);
    const r = await call(admin, 'POST', `/admin/users/${bob.id}/reset`);
    expect(r.statusCode).toBe(200);
    const token = r.json().url.split('#')[1];
    expect(
      (
        await call(undefined, 'POST', '/auth/reset', {
          token,
          password: 'another-strong-test-password',
        })
      ).statusCode,
    ).toBe(200);
    expect((await call(bob, 'GET', '/auth/me')).statusCode).toBe(401);
    expect((await call(k.secret, 'GET', `/spaces/${group}/expenses`)).statusCode).toBe(401);
    expect(
      (
        await call(undefined, 'POST', '/auth/reset', {
          token,
          password: 'another-strong-test-password',
        })
      ).statusCode,
    ).toBe(400);
  });
  it('disables accounts immediately and preserves group ownership', async () => {
    const k = await key(alice, [{ spaceId: group, resource: 'expenses', operations: ['read'] }]);
    expect((await call(admin, 'DELETE', `/spaces/${group}/members/${admin.id}`)).statusCode).toBe(
      403,
    );
    expect(
      (await call(admin, 'PATCH', `/admin/users/${admin.id}`, { active: false })).statusCode,
    ).toBe(400);
    expect(
      (await call(admin, 'PATCH', `/admin/users/${alice.id}`, { active: false })).statusCode,
    ).toBe(200);
    expect((await call(alice, 'GET', '/auth/me')).statusCode).toBe(401);
    expect((await call(k.secret, 'GET', `/spaces/${group}/expenses`)).statusCode).toBe(401);
  });
  it('publishes OpenAPI contracts and prevents API response caching', async () => {
    const r = await call(admin, 'GET', '/openapi.json');
    expect(r.statusCode, r.body).toBe(200);
    expect(r.json().paths['/api/v1/spaces/{spaceId}/expenses'].post.requestBody).toBeDefined();
    expect(r.headers['cache-control']).toBe('no-store');
  });
});
