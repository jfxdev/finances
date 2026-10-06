import argon2 from 'argon2';
import { and, eq, isNull, gt } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { registerSchema, loginSchema } from '@finances/contracts';
import { installation, users, sessions, apiKeys, resets, type Store } from './db.js';
import { secret, hash, equalSecret } from './crypto.js';
import { fail } from './domain.js';
import type { Service, Principal } from './service.js';
export const passwordHash = (password: string) =>
  argon2.hash(password, { type: argon2.argon2id, memoryCost: 19456, timeCost: 2, parallelism: 1 });
const dummyPasswordHash = passwordHash(secret());
export const publicUser = (u: typeof users.$inferSelect) => ({
  id: u.id,
  email: u.email,
  name: u.name,
  admin: u.admin,
});
export class Auth {
  constructor(readonly service: Service) {}
  async session(userId: string, reply: FastifyReply, store: Store = this.service.db) {
    const token = secret(),
      csrf = secret();
    const expiresAt = new Date(Date.now() + 7 * 86400000);
    await store.insert(sessions).values({ tokenHash: hash(token), csrf, userId, expiresAt });
    reply.setCookie('finances_session', token, {
      path: '/',
      httpOnly: true,
      secure: this.service.config.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: expiresAt,
    });
    return csrf;
  }
  async register(input: unknown, reply: FastifyReply) {
    const data = registerSchema.parse(input);
    const digest = await passwordHash(data.password);
    const user = await this.service.db.transaction(async (tx) => {
      const [state] = await tx
        .select()
        .from(installation)
        .where(eq(installation.id, true))
        .for('update');
      const configured = state?.configured;
      if (!configured && !equalSecret(data.setupToken ?? '', this.service.config.SETUP_TOKEN))
        fail(403, 'SETUP_TOKEN_REQUIRED', 'Informe o token de configuração da instalação');
      const [exists] = await tx
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, data.email));
      if (exists) fail(409, 'EMAIL_IN_USE', 'Email já cadastrado');
      const [u] = await tx
        .insert(users)
        .values({
          id: randomUUID(),
          email: data.email,
          name: data.name,
          passwordHash: digest,
          admin: !configured,
        })
        .returning();
      await this.service.createSpace(tx, u.id, 'Pessoal', 'BRL', 'America/Sao_Paulo', true);
      if (!configured)
        await tx.update(installation).set({ configured: true }).where(eq(installation.id, true));
      await this.service.audit(tx, { userId: u.id }, null, null, null, 'register');
      return u;
    });
    return { user: publicUser(user), csrf: await this.session(user.id, reply) };
  }
  async login(input: unknown, reply: FastifyReply) {
    const data = loginSchema.parse(input);
    return this.service.db.transaction(async (tx) => {
      const [user] = await tx.select().from(users).where(eq(users.email, data.email)).for('share');
      const valid = await argon2.verify(
        user?.passwordHash ?? (await dummyPasswordHash),
        data.password,
      );
      if (!user || !valid || !user.active) fail(401, 'INVALID_LOGIN', 'Email ou senha inválidos');
      await this.service.audit(tx, { userId: user.id }, null, null, null, 'login');
      return { user: publicUser(user), csrf: await this.session(user.id, reply, tx) };
    });
  }

  async principal(req: FastifyRequest, write = false): Promise<Principal> {
    const bearer = req.headers.authorization;
    if (bearer) {
      if (!/^Bearer [A-Za-z0-9_-]{43}$/.test(bearer)) fail(401, 'INVALID_KEY', 'Chave inválida');
      const [row] = await this.service.db
        .select({ key: apiKeys, user: users })
        .from(apiKeys)
        .innerJoin(users, eq(users.id, apiKeys.userId))
        .where(
          and(
            eq(apiKeys.tokenHash, hash(bearer.slice(7))),
            isNull(apiKeys.revokedAt),
            eq(users.active, true),
          ),
        );
      if (!row || (row.key.expiresAt && row.key.expiresAt <= new Date()))
        fail(401, 'INVALID_KEY', 'Chave inválida ou expirada');
      return { userId: row.user.id, keyId: row.key.id };
    }
    const token = req.cookies.finances_session;
    if (!token) fail(401, 'UNAUTHENTICATED', 'Entre na sua conta');
    const [row] = await this.service.db
      .select({ session: sessions, user: users })
      .from(sessions)
      .innerJoin(users, eq(users.id, sessions.userId))
      .where(
        and(
          eq(sessions.tokenHash, hash(token)),
          gt(sessions.expiresAt, new Date()),
          eq(users.active, true),
        ),
      );
    if (!row) fail(401, 'UNAUTHENTICATED', 'Sessão expirada');
    if (
      write &&
      !equalSecret(
        typeof req.headers['x-csrf-token'] === 'string' ? req.headers['x-csrf-token'] : '',
        row.session.csrf,
      )
    )
      fail(403, 'CSRF_INVALID', 'Atualize a página e tente novamente');
    return { userId: row.user.id };
  }
  async human(req: FastifyRequest, write = false, admin = false) {
    const p = await this.principal(req, write);
    if (p.keyId) fail(403, 'SESSION_REQUIRED', 'Esta ação exige uma sessão de usuário');
    const [user] = await this.service.db.select().from(users).where(eq(users.id, p.userId));
    if (admin && !user.admin) fail(403, 'ADMIN_REQUIRED', 'Acesso de administrador necessário');
    return { p, user };
  }
  async changePassword(
    req: FastifyRequest,
    reply: FastifyReply,
    current: string,
    password: string,
  ) {
    const { p } = await this.human(req, true);
    const digest = await passwordHash(password);
    await this.service.db.transaction(async (tx) => {
      const [user] = await tx.select().from(users).where(eq(users.id, p.userId)).for('update');
      if (!(await argon2.verify(user.passwordHash, current)))
        fail(401, 'INVALID_PASSWORD', 'Senha atual inválida');
      await tx.update(users).set({ passwordHash: digest }).where(eq(users.id, p.userId));
      await tx.delete(sessions).where(eq(sessions.userId, p.userId));
      await tx.update(apiKeys).set({ revokedAt: new Date() }).where(eq(apiKeys.userId, p.userId));
      await this.service.audit(tx, p, null, null, null, 'change_password');
    });
    reply.clearCookie('finances_session', { path: '/' });
    return { ok: true };
  }
  async reset(token: string, password: string) {
    const digest = await passwordHash(password);
    await this.service.db.transaction(async (tx) => {
      const [reset] = await tx
        .select()
        .from(resets)
        .where(
          and(
            eq(resets.tokenHash, hash(token)),
            isNull(resets.usedAt),
            gt(resets.expiresAt, new Date()),
          ),
        )
        .for('update');
      if (!reset) fail(400, 'INVALID_RESET', 'Link inválido ou expirado');
      await tx.update(users).set({ passwordHash: digest }).where(eq(users.id, reset.userId));
      await tx
        .update(resets)
        .set({ usedAt: new Date() })
        .where(eq(resets.tokenHash, reset.tokenHash));
      await tx.delete(sessions).where(eq(sessions.userId, reset.userId));
      await tx
        .update(apiKeys)
        .set({ revokedAt: new Date() })
        .where(eq(apiKeys.userId, reset.userId));
      await this.service.audit(tx, { userId: reset.userId }, null, null, null, 'password_reset');
    });
    return { ok: true };
  }
}
