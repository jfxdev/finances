import Fastify from 'fastify';
import cookie from '@fastify/cookie';
import rateLimit from '@fastify/rate-limit';
import swagger from '@fastify/swagger';
import {
  validatorCompiler,
  serializerCompiler,
  jsonSchemaTransform,
} from 'fastify-type-provider-zod';
import { z } from 'zod';
import { errorResponseSchema } from '@finances/contracts';
import { randomUUID } from 'node:crypto';
import { database, audits, spaces, installation } from './db.js';
import { eq } from 'drizzle-orm';
import { Service } from './service.js';
import { Auth } from './auth.js';
import { routes } from './routes.js';
import { mcpRoutes } from './mcp.js';
import { AppError } from './domain.js';
import type { Config } from './config.js';
import { isAllowedOrigin } from './origins.js';
export async function buildApp(config: Config, logging = false) {
  const { db, pool } = database(config.DATABASE_URL);
  const service = new Service(db, config);
  const app = Fastify({
    logger: logging
      ? {
          level: 'info',
          serializers: {
            req: (r) => ({ method: r.method, path: r.url?.split('?')[0], id: r.id }),
            res: (r) => ({ statusCode: r.statusCode }),
          },
        }
      : false,
    bodyLimit: 65536,
  });
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);
  await app.register(cookie);
  // The browser suite runs several isolated user journeys from one runner IP.
  // Keep production's brute-force protection while giving that test-only shared
  // address enough room to exercise the complete workflows without a timeout.
  await app.register(rateLimit, {
    max: config.NODE_ENV === 'test' ? 3_000 : 300,
    timeWindow: '1 minute',
  });
  await app.register(swagger, {
    openapi: {
      info: { title: 'Finances API', version: '0.1.0' },
      components: {
        securitySchemes: {
          apiKey: { type: 'http', scheme: 'bearer' },
          session: { type: 'apiKey', in: 'cookie', name: 'finances_session' },
        },
      },
      security: [{ apiKey: [] }, { session: [] }],
    },
    transform: jsonSchemaTransform,
  });
  app.addHook('onRequest', async (req, reply) => {
    reply
      .header('X-Content-Type-Options', 'nosniff')
      .header('Referrer-Policy', 'no-referrer')
      .header('X-Frame-Options', 'DENY');
    const origin = req.headers.origin;
    if (
      origin &&
      !isAllowedOrigin(config, origin) &&
      !['GET', 'HEAD', 'OPTIONS'].includes(req.method)
    )
      throw new AppError(403, 'INVALID_ORIGIN', 'Origem inválida');
  });
  app.addHook('onSend', async (req, reply, payload) => {
    if (req.url.startsWith('/api') || req.url.startsWith('/mcp'))
      reply.header('Cache-Control', 'no-store');
    return payload;
  });
  app.setErrorHandler(async (error, req, reply) => {
    const e = error as Error & { validation?: unknown; code?: string; statusCode?: number };
    const cause = e.cause as { code?: string } | undefined;
    const dbCode = e.code ?? cause?.code;
    let status = 500,
      code = 'INTERNAL_ERROR',
      message = 'Não foi possível concluir a operação';
    if (error instanceof AppError) {
      status = error.status;
      code = error.code;
      message = error.message;
    } else if (error instanceof z.ZodError || e.validation) {
      status = 400;
      code = 'VALIDATION_ERROR';
      message = 'Confira os campos informados';
    } else if (dbCode === '23505') {
      status = 409;
      code = 'DUPLICATE_RECORD';
      message = 'Já existe um registro com esses dados';
    } else if (e.statusCode === 429) {
      status = 429;
      code = 'RATE_LIMITED';
      message = 'Muitas tentativas. Aguarde um momento';
    } else if (e.statusCode && e.statusCode < 500) {
      status = e.statusCode;
      code = 'INVALID_REQUEST';
      message = 'Requisição inválida';
    }
    if (status === 500)
      app.log.error({ code: dbCode ?? 'unknown', requestId: req.id }, 'Falha interna');
    if (req.url.startsWith('/api') || req.url === '/mcp') {
      try {
        const principal = await new Auth(service).principal(req);
        const params = req.params as { spaceId?: string; id?: string } | undefined;
        let spaceId: string | null = null;
        if (params?.spaceId && z.uuid().safeParse(params.spaceId).success) {
          const [space] = await db
            .select({ id: spaces.id })
            .from(spaces)
            .where(eq(spaces.id, params.spaceId));
          spaceId = space?.id ?? null;
        }
        await db.insert(audits).values({
          id: randomUUID(),
          actorId: principal.userId,
          keyId: principal.keyId ?? null,
          spaceId,
          recordId: null,
          resource: null,
          operation: req.method,
          result: code,
        });
      } catch {
        /* Authentication failures have no trusted actor. */
      }
    }
    return reply.code(status).send({ error: { code, message } });
  });
  app.addHook('onRoute', (route) => {
    if (route.url.startsWith('/api/')) {
      route.schema ??= {};
      route.schema.response = {
        400: errorResponseSchema,
        401: errorResponseSchema,
        403: errorResponseSchema,
        404: errorResponseSchema,
        409: errorResponseSchema,
        429: errorResponseSchema,
        500: errorResponseSchema,
        ...(route.schema.response as Record<string, unknown> | undefined),
      };
    }
  });
  await routes(app, service);
  await mcpRoutes(app, service);
  app.get('/api/v1/openapi.json', async () => app.swagger());
  app.get('/health/live', async () => ({ ok: true }));
  app.get('/health/ready', async () => {
    const [state] = await db
      .select({ id: installation.id })
      .from(installation)
      .where(eq(installation.id, true));
    if (!state) throw new Error('Migrations não aplicadas');
    return { ok: true };
  });
  app.addHook('onClose', async () => {
    await pool.end();
  });
  return { app, service, pool };
}
