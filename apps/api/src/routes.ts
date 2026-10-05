import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { and, eq, isNull, sql, desc } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';
import {
  schemas,
  resources,
  registerSchema,
  loginSchema,
  keySchema,
  spaceSchema,
  querySchema,
  idSchema,
  dateSchema,
  entityResponseSchema,
  sessionResponseSchema,
  spaceResponseSchema,
  summaryResponseSchema,
  reportResponseSchema,
  type Space,
} from '@finances/contracts';
import {
  users,
  spaces,
  members,
  installation,
  sessions,
  apiKeys,
  invites,
  resets,
  records,
  audits,
} from './db.js';
import { encrypt, decrypt, secret, hash } from './crypto.js';
import { Auth, publicUser } from './auth.js';
import { fail, monthRange } from './domain.js';
import type { Service } from './service.js';
const spaceParams = z.object({ spaceId: idSchema });
const recordParams = spaceParams.extend({ id: idSchema });
const versionSchema = z.number().int().positive();
export async function routes(app: FastifyInstance, service: Service) {
  const auth = new Auth(service);
  app.get('/api/v1/auth/setup', async () => {
    const [state] = await service.db
      .select({ configured: installation.configured })
      .from(installation)
      .where(eq(installation.id, true));
    return { configured: state.configured };
  });
  app.post(
    '/api/v1/auth/register',
    {
      schema: { body: registerSchema, response: { 201: sessionResponseSchema } },
      config: { rateLimit: { max: 10, timeWindow: '1 minute' } },
    },
    async (req, reply) => {
      reply.code(201);
      return auth.register(req.body, reply);
    },
  );
  app.post(
    '/api/v1/auth/login',
    {
      schema: { body: loginSchema, response: { 200: sessionResponseSchema } },
      config: { rateLimit: { max: 10, timeWindow: '1 minute' } },
    },
    async (req, reply) => auth.login(req.body, reply),
  );
  app.get(
    '/api/v1/auth/me',
    { schema: { response: { 200: sessionResponseSchema } } },
    async (req) => {
      const { p, user } = await auth.human(req);
      const [session] = await service.db
        .select()
        .from(sessions)
        .where(eq(sessions.tokenHash, hash(req.cookies.finances_session!)));
      return { user: publicUser(user), csrf: session.csrf };
    },
  );
  app.post('/api/v1/auth/logout', async (req, reply) => {
    await auth.human(req, true);
    await service.db
      .delete(sessions)
      .where(eq(sessions.tokenHash, hash(req.cookies.finances_session!)));
    reply.clearCookie('finances_session', { path: '/' });
    return { ok: true };
  });
  app.post(
    '/api/v1/auth/reset',
    {
      schema: {
        body: z
          .object({ token: z.string().min(1), password: z.string().min(12).max(128) })
          .strict(),
      },
      config: { rateLimit: { max: 10, timeWindow: '1 minute' } },
    },
    async (req) => {
      const body = req.body as { token: string; password: string };
      return auth.reset(body.token, body.password);
    },
  );
  app.post(
    '/api/v1/auth/password',
    {
      schema: {
        body: z
          .object({
            currentPassword: z.string().min(1).max(128),
            password: z.string().min(12).max(128),
          })
          .strict(),
      },
      config: { rateLimit: { max: 10, timeWindow: '1 minute' } },
    },
    async (req, reply) => {
      const d = req.body as { currentPassword: string; password: string };
      return auth.changePassword(req, reply, d.currentPassword, d.password);
    },
  );
  app.get(
    '/api/v1/spaces',
    { schema: { response: { 200: z.array(spaceResponseSchema) } } },
    async (req) => {
      const p = await auth.principal(req);
      return service.db.transaction(async (tx) => {
        const rows = await tx
          .select({ space: spaces, role: members.role })
          .from(spaces)
          .innerJoin(members, eq(members.spaceId, spaces.id))
          .where(eq(members.userId, p.userId));
        const result: Space[] = [];
        for (const { space, role } of rows) {
          if (p.keyId) {
            const [key] = await tx.select().from(apiKeys).where(eq(apiKeys.id, p.keyId));
            if (!key?.grants.some((g) => g.spaceId === space.id)) continue;
          }
          result.push({
            id: space.id,
            name: decrypt<string>(service.key(space), `space-title:${space.id}`, space.title),
            currency: space.currency,
            timezone: space.timezone,
            personal: space.personal,
            role,
            version: space.version,
          });
        }
        return result;
      });
    },
  );
  app.post('/api/v1/spaces', { schema: { body: spaceSchema } }, async (req, reply) => {
    const { p } = await auth.human(req, true);
    const d = spaceSchema.parse(req.body);
    const id = await service.db.transaction(async (tx) => {
      const id = await service.createSpace(tx, p.userId, d.name, d.currency, d.timezone);
      await service.audit(tx, p, id, null, null, 'create_space');
      return id;
    });
    reply.code(201);
    return { id };
  });
  app.patch(
    '/api/v1/spaces/:spaceId',
    { schema: { params: spaceParams, body: spaceSchema.extend({ version: versionSchema }) } },
    async (req) => {
      const { p } = await auth.human(req, true);
      const { spaceId } = spaceParams.parse(req.params);
      const d = spaceSchema.extend({ version: versionSchema }).parse(req.body);
      return service.db.transaction(async (tx) => {
        await tx.select().from(spaces).where(eq(spaces.id, spaceId)).for('update');
        const { space, role } = await service.authorize(tx, p, spaceId, undefined, 'update');
        if (role !== 'owner') fail(403, 'OWNER_REQUIRED', 'Apenas o dono pode alterar o espaço');
        await tx.select().from(spaces).where(eq(spaces.id, spaceId)).for('update');
        if (space.version !== d.version) fail(409, 'VERSION_CONFLICT', 'Espaço alterado');
        if (space.currency !== d.currency) {
          const [record] = await tx
            .select({ id: records.id })
            .from(records)
            .where(and(eq(records.spaceId, spaceId), sql`${records.resource}<>'categories'`))
            .limit(1);
          if (record)
            fail(409, 'CURRENCY_LOCKED', 'A moeda não pode mudar após um registro financeiro');
        }
        await tx
          .update(spaces)
          .set({
            title: encrypt(service.key(space), `space-title:${spaceId}`, d.name),
            currency: d.currency,
            timezone: d.timezone,
            version: space.version + 1,
          })
          .where(eq(spaces.id, spaceId));
        await service.audit(tx, p, spaceId, null, null, 'update_space');
        return { ok: true };
      });
    },
  );
  app.get('/api/v1/spaces/:spaceId/members', { schema: { params: spaceParams } }, async (req) => {
    const { p } = await auth.human(req);
    const { spaceId } = spaceParams.parse(req.params);
    await service.authorize(service.db, p, spaceId);
    return service.db
      .select({ id: users.id, name: users.name, role: members.role })
      .from(members)
      .innerJoin(users, eq(users.id, members.userId))
      .where(eq(members.spaceId, spaceId));
  });
  const memberParams = spaceParams.extend({ userId: idSchema });
  const inviteSchema = z
    .object({ role: z.enum(['editor', 'reader']), sharePersonal: z.boolean().default(false) })
    .strict();
  app.patch(
    '/api/v1/spaces/:spaceId/members/:userId',
    {
      schema: {
        params: memberParams,
        body: z.object({ role: z.enum(['owner', 'editor', 'reader']) }).strict(),
      },
    },
    async (req) => {
      const { p } = await auth.human(req, true);
      const { spaceId, userId } = memberParams.parse(req.params);
      const { role: next } = z
        .object({ role: z.enum(['owner', 'editor', 'reader']) })
        .parse(req.body);
      return service.db.transaction(async (tx) => {
        await tx.select().from(spaces).where(eq(spaces.id, spaceId)).for('update');
        const { space, role } = await service.authorize(tx, p, spaceId, undefined, 'update');
        if (space.personal || role !== 'owner')
          fail(403, 'OWNER_REQUIRED', 'Apenas o dono gerencia os membros do grupo');
        const [target] = await tx
          .select()
          .from(members)
          .where(and(eq(members.spaceId, spaceId), eq(members.userId, userId)));
        if (!target) fail(404, 'NOT_FOUND', 'Membro não encontrado');
        if (userId === p.userId)
          fail(400, 'OWNER_REQUIRED', 'Transfira a propriedade para outro membro');
        if (next === 'owner')
          await tx
            .update(members)
            .set({ role: 'editor' })
            .where(and(eq(members.spaceId, spaceId), eq(members.userId, p.userId)));
        await tx
          .update(members)
          .set({ role: next })
          .where(and(eq(members.spaceId, spaceId), eq(members.userId, userId)));
        await service.audit(
          tx,
          p,
          spaceId,
          null,
          null,
          next === 'owner' ? 'transfer_owner' : 'update_member',
        );
        return { ok: true };
      });
    },
  );
  app.delete(
    '/api/v1/spaces/:spaceId/members/:userId',
    { schema: { params: memberParams } },
    async (req) => {
      const { p } = await auth.human(req, true);
      const { spaceId, userId } = memberParams.parse(req.params);
      return service.db.transaction(async (tx) => {
        const { space, role } = await service.authorize(tx, p, spaceId, undefined, 'update');
        if (space.personal || role !== 'owner' || userId === p.userId)
          fail(403, 'OWNER_REQUIRED', 'O dono não pode ser removido; transfira a propriedade');
        await tx
          .delete(members)
          .where(and(eq(members.spaceId, spaceId), eq(members.userId, userId)));
        await service.audit(tx, p, spaceId, null, null, 'remove_member');
        return { ok: true };
      });
    },
  );
  app.post(
    '/api/v1/spaces/:spaceId/invites',
    {
      schema: {
        params: spaceParams,
        body: inviteSchema,
      },
    },
    async (req) => {
      const { p } = await auth.human(req, true);
      const { spaceId } = spaceParams.parse(req.params);
      const { role: inviteRole, sharePersonal } = inviteSchema.parse(req.body);
      return service.db.transaction(async (tx) => {
        await tx.select().from(spaces).where(eq(spaces.id, spaceId)).for('update');
        const { space, role } = await service.authorize(tx, p, spaceId, undefined, 'create');
        if (role !== 'owner') fail(403, 'OWNER_REQUIRED', 'Apenas o dono convida membros');
        if (space.personal) {
          if (!sharePersonal)
            fail(400, 'PERSONAL_SPACE', 'Confirme o compartilhamento do espaço pessoal');
          await tx
            .update(spaces)
            .set({ personal: false, version: space.version + 1 })
            .where(eq(spaces.id, spaceId));
          await service.audit(tx, p, spaceId, null, null, 'share_space');
        }
        const token = secret();
        await tx.insert(invites).values({
          tokenHash: hash(token),
          spaceId,
          role: inviteRole,
          expiresAt: new Date(Date.now() + 7 * 86400000),
        });
        await service.audit(tx, p, spaceId, null, null, 'invite_member');
        return { url: `${service.config.PUBLIC_URL}/invite#${token}` };
      });
    },
  );
  app.post(
    '/api/v1/invites/accept',
    { schema: { body: z.object({ token: z.string().min(1) }).strict() } },
    async (req) => {
      const { p } = await auth.human(req, true);
      const { token } = z.object({ token: z.string() }).parse(req.body);
      return service.db.transaction(async (tx) => {
        const [invite] = await tx
          .select()
          .from(invites)
          .where(and(eq(invites.tokenHash, hash(token)), isNull(invites.usedAt)))
          .for('update');
        if (!invite || invite.expiresAt <= new Date())
          fail(400, 'INVALID_INVITE', 'Convite inválido ou expirado');
        const [existing] = await tx
          .select()
          .from(members)
          .where(and(eq(members.spaceId, invite.spaceId), eq(members.userId, p.userId)));
        if (existing) fail(409, 'ALREADY_MEMBER', 'Você já participa deste espaço');
        await tx
          .insert(members)
          .values({ spaceId: invite.spaceId, userId: p.userId, role: invite.role });
        await tx
          .update(invites)
          .set({ usedAt: new Date() })
          .where(eq(invites.tokenHash, invite.tokenHash));
        await service.audit(tx, p, invite.spaceId, null, null, 'accept_invite');
        return { spaceId: invite.spaceId };
      });
    },
  );
  app.get('/api/v1/keys', async (req) => {
    const { p } = await auth.human(req);
    return service.db
      .select({
        id: apiKeys.id,
        name: apiKeys.name,
        grants: apiKeys.grants,
        expiresAt: apiKeys.expiresAt,
        revokedAt: apiKeys.revokedAt,
        createdAt: apiKeys.createdAt,
      })
      .from(apiKeys)
      .where(eq(apiKeys.userId, p.userId))
      .orderBy(desc(apiKeys.createdAt));
  });
  app.post('/api/v1/keys', { schema: { body: keySchema } }, async (req, reply) => {
    const { p } = await auth.human(req, true);
    const data = keySchema.parse(req.body);
    if (data.expiresAt && new Date(data.expiresAt) <= new Date())
      fail(400, 'EXPIRY_IN_PAST', 'A expiração deve ser futura');
    return service.db.transaction(async (tx) => {
      for (const grant of data.grants)
        for (const op of grant.operations)
          await service.authorize(tx, p, grant.spaceId, grant.resource, op);
      const token = secret(),
        id = randomUUID();
      await tx.insert(apiKeys).values({
        id,
        userId: p.userId,
        name: data.name,
        tokenHash: hash(token),
        grants: data.grants,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      });
      await service.audit(tx, p, null, null, null, 'create_key');
      reply.code(201);
      return { id, secret: token };
    });
  });
  app.delete(
    '/api/v1/keys/:id',
    { schema: { params: z.object({ id: idSchema }) } },
    async (req) => {
      const { p } = await auth.human(req, true);
      const { id } = z.object({ id: idSchema }).parse(req.params);
      const result = await service.db
        .update(apiKeys)
        .set({ revokedAt: new Date() })
        .where(and(eq(apiKeys.id, id), eq(apiKeys.userId, p.userId)))
        .returning({ id: apiKeys.id });
      if (!result.length) fail(404, 'NOT_FOUND', 'Chave não encontrada');
      await service.audit(service.db, p, null, null, null, 'revoke_key');
      return { ok: true };
    },
  );
  for (const resource of resources) {
    const path = `/api/v1/spaces/:spaceId/${resource}`;
    const schema = schemas[resource];
    app.get(
      path,
      {
        schema: {
          params: spaceParams,
          querystring: querySchema,
          response: {
            200: z.object({
              items: z.array(entityResponseSchema),
              total: z.number(),
              page: z.number(),
              limit: z.number(),
            }),
          },
          tags: ['Finanças'],
        },
      },
      async (req) => {
        const p = await auth.principal(req);
        return service.list(
          p,
          spaceParams.parse(req.params).spaceId,
          resource,
          querySchema.parse(req.query),
        );
      },
    );
    app.get(
      `${path}/:id`,
      {
        schema: {
          params: recordParams,
          response: { 200: entityResponseSchema },
          tags: ['Finanças'],
        },
      },
      async (req) => {
        const p = await auth.principal(req);
        const { spaceId, id } = recordParams.parse(req.params);
        return service.get(p, spaceId, resource, id);
      },
    );
    app.post(
      path,
      {
        schema: {
          params: spaceParams,
          body: schema,
          headers: z.object({ 'idempotency-key': z.string().min(1).max(128).optional() }),
          response: { 201: entityResponseSchema },
          tags: ['Finanças'],
        },
      },
      async (req, reply) => {
        const p = await auth.principal(req, true);
        reply.code(201);
        return service.create(
          p,
          spaceParams.parse(req.params).spaceId,
          resource,
          req.body,
          req.headers['idempotency-key'] as string | undefined,
        );
      },
    );
    app.patch(
      `${path}/:id`,
      {
        schema: {
          params: recordParams,
          body: z
            .object({
              version: versionSchema,
              data: schema,
              effectiveFrom:
                resource === 'recurrences' ? dateSchema.optional() : z.never().optional(),
            })
            .strict(),
          response: { 200: entityResponseSchema },
          tags: ['Finanças'],
        },
      },
      async (req) => {
        const p = await auth.principal(req, true);
        const { spaceId, id } = recordParams.parse(req.params);
        const d = req.body as { version: number; data: unknown; effectiveFrom?: string };
        return service.update(p, spaceId, resource, id, d.version, d.data, d.effectiveFrom);
      },
    );
    app.delete(
      `${path}/:id`,
      {
        schema: {
          params: recordParams,
          body: z.object({ version: versionSchema }).strict(),
          tags: ['Finanças'],
        },
      },
      async (req) => {
        const p = await auth.principal(req, true);
        const { spaceId, id } = recordParams.parse(req.params);
        return service.remove(p, spaceId, resource, id, (req.body as { version: number }).version);
      },
    );
  }
  app.get(
    '/api/v1/spaces/:spaceId/summary',
    {
      schema: {
        params: spaceParams,
        querystring: z.object({ month: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/) }),
        response: { 200: summaryResponseSchema },
      },
    },
    async (req) => {
      const p = await auth.principal(req);
      const { month } = z.object({ month: z.string() }).parse(req.query);
      const { from, to } = monthRange(month);
      return service.summary(p, spaceParams.parse(req.params).spaceId, from, to);
    },
  );
  app.get(
    '/api/v1/spaces/:spaceId/investments/:id/report',
    { schema: { params: recordParams, response: { 200: reportResponseSchema } } },
    async (req) => {
      const p = await auth.principal(req);
      const { spaceId, id } = recordParams.parse(req.params);
      return service.report(p, spaceId, id);
    },
  );
  app.get(
    '/api/v1/spaces/:spaceId/audit',
    { schema: { params: spaceParams, querystring: querySchema } },
    async (req) => {
      const { p } = await auth.human(req);
      const { spaceId } = spaceParams.parse(req.params);
      const { role } = await service.authorize(service.db, p, spaceId);
      if (role !== 'owner') fail(403, 'OWNER_REQUIRED', 'Apenas o dono consulta a auditoria');
      const q = querySchema.parse(req.query);
      return service.db
        .select()
        .from(audits)
        .where(eq(audits.spaceId, spaceId))
        .orderBy(desc(audits.createdAt))
        .limit(q.limit)
        .offset((q.page - 1) * q.limit);
    },
  );
  app.get('/api/v1/admin/users', async (req) => {
    await auth.human(req, false, true);
    return service.db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        admin: users.admin,
        active: users.active,
      })
      .from(users);
  });
  app.patch(
    '/api/v1/admin/users/:id',
    {
      schema: {
        params: z.object({ id: idSchema }),
        body: z.object({ active: z.boolean() }).strict(),
      },
    },
    async (req) => {
      const { p } = await auth.human(req, true, true);
      const { id } = z.object({ id: idSchema }).parse(req.params);
      const { active } = z.object({ active: z.boolean() }).parse(req.body);
      return service.db.transaction(async (tx) => {
        await tx.select().from(installation).where(eq(installation.id, true)).for('update');
        const [target] = await tx.select().from(users).where(eq(users.id, id));
        if (!target) fail(404, 'NOT_FOUND', 'Usuário não encontrado');
        if (target.admin && !active)
          fail(400, 'ADMIN_REQUIRED', 'O administrador inicial não pode ser desativado');
        await tx.update(users).set({ active }).where(eq(users.id, id));
        if (!active) {
          await tx.delete(sessions).where(eq(sessions.userId, id));
          await tx.update(apiKeys).set({ revokedAt: new Date() }).where(eq(apiKeys.userId, id));
        }
        await service.audit(tx, p, null, null, null, 'update_user');
        return { ok: true };
      });
    },
  );
  app.post(
    '/api/v1/admin/users/:id/reset',
    { schema: { params: z.object({ id: idSchema }) } },
    async (req) => {
      const { p } = await auth.human(req, true, true);
      const { id } = z.object({ id: idSchema }).parse(req.params);
      return service.db.transaction(async (tx) => {
        const [target] = await tx.select().from(users).where(eq(users.id, id));
        if (!target) fail(404, 'NOT_FOUND', 'Usuário não encontrado');
        await tx.delete(resets).where(eq(resets.userId, id));
        const token = secret();
        await tx.insert(resets).values({
          tokenHash: hash(token),
          userId: id,
          expiresAt: new Date(Date.now() + 3600000),
        });
        await service.audit(tx, p, null, null, null, 'create_reset');
        return { url: `${service.config.PUBLIC_URL}/reset#${token}` };
      });
    },
  );
}
