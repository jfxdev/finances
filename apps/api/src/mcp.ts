import type { FastifyInstance } from 'fastify';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { z } from 'zod';
import { resources, schemas, idSchema, dateSchema, querySchema } from '@finances/contracts';
import { Auth } from './auth.js';
import { AppError, fail, monthRange } from './domain.js';
import type { Service, Principal } from './service.js';
import { isAllowedOrigin, isAllowedHost } from './origins.js';
export function createMcp(service: Service, p: Principal, listSpaces: () => Promise<unknown>) {
  const server = new McpServer({ name: 'finances', version: '0.1.0' });
  function tool(
    name: string,
    title: string,
    inputSchema: z.ZodType,
    read: boolean,
    destructive: boolean,
    run: (input: Record<string, unknown>) => Promise<unknown>,
  ) {
    server.registerTool(
      name,
      {
        title,
        description: title,
        inputSchema,
        annotations: {
          readOnlyHint: read,
          destructiveHint: destructive,
          idempotentHint: read,
          openWorldHint: false,
        },
      },
      async (args) => {
        try {
          const result = await run(args as Record<string, unknown>);
          return { content: [{ type: 'text', text: JSON.stringify(result) }] };
        } catch (e) {
          const error =
            e instanceof AppError
              ? { code: e.code, message: e.message }
              : e instanceof z.ZodError
                ? {
                    code: 'VALIDATION_ERROR',
                    message: 'Dados inválidos',
                    issues: e.issues.map((i) => ({ path: i.path, message: i.message })),
                  }
                : { code: 'INTERNAL_ERROR', message: 'Não foi possível concluir a operação' };
          await service.audit(service.db, p, null, null, null, `mcp:${name}`, 'error');
          return { isError: true, content: [{ type: 'text', text: JSON.stringify({ error }) }] };
        }
      },
    );
  }
  tool('list_spaces', 'Consultar espaços autorizados', z.object({}), true, false, listSpaces);
  const base = z.object({ spaceId: idSchema });
  for (const r of resources) {
    tool(
      `list_${r}`,
      `Consultar ${r}`,
      base.extend({ query: querySchema.optional() }),
      true,
      false,
      (a) => service.list(p, a.spaceId as string, r, querySchema.parse(a.query ?? {})),
    );
    tool(
      `get_${r}`,
      `Consultar registro de ${r}`,
      base.extend({ id: idSchema }),
      true,
      false,
      (a) => service.get(p, a.spaceId as string, r, a.id as string),
    );
    tool(
      `create_${r}`,
      `Criar ${r}`,
      base.extend({ data: schemas[r], idempotencyKey: z.string().min(1).max(128).optional() }),
      false,
      false,
      (a) =>
        service.create(p, a.spaceId as string, r, a.data, a.idempotencyKey as string | undefined),
    );
    tool(
      `update_${r}`,
      `Alterar ${r}`,
      base.extend({
        id: idSchema,
        version: z.number().int().positive(),
        data: schemas[r],
        effectiveFrom: r === 'recurrences' ? dateSchema.optional() : z.never().optional(),
      }),
      false,
      false,
      (a) =>
        service.update(
          p,
          a.spaceId as string,
          r,
          a.id as string,
          a.version as number,
          a.data,
          a.effectiveFrom as string | undefined,
        ),
    );
    tool(
      `delete_${r}`,
      `Excluir ${r}`,
      base.extend({ id: idSchema, version: z.number().int().positive() }),
      false,
      true,
      (a) => service.remove(p, a.spaceId as string, r, a.id as string, a.version as number),
    );
  }
  tool(
    'get_summary',
    'Consultar resumo mensal autorizado',
    base.extend({ month: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/) }),
    true,
    false,
    (a) => {
      const { from, to } = monthRange(a.month as string);
      return service.summary(p, a.spaceId as string, from, to);
    },
  );
  tool(
    'get_investment_report',
    'Consultar evolução de investimento',
    base.extend({ id: idSchema }),
    true,
    false,
    (a) => service.report(p, a.spaceId as string, a.id as string),
  );
  return server;
}
export async function mcpRoutes(app: FastifyInstance, service: Service) {
  app.post('/mcp', async (req, reply) => {
    if (!isAllowedHost(service.config, req.headers.host))
      fail(400, 'INVALID_HOST', 'Host MCP inválido');
    if (req.headers.origin && !isAllowedOrigin(service.config, req.headers.origin))
      fail(403, 'INVALID_ORIGIN', 'Origem MCP inválida');
    if (!req.headers.authorization) fail(401, 'KEY_REQUIRED', 'MCP exige uma API key');
    const p = await new Auth(service).principal(req);
    const server = createMcp(service, p, async () => {
      const response = await app.inject({
        url: '/api/v1/spaces',
        headers: { authorization: req.headers.authorization! },
      });
      if (response.statusCode !== 200) fail(response.statusCode, 'INVALID_KEY', 'Acesso inválido');
      return response.json();
    });
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
    });
    await server.connect(transport);
    reply.hijack();
    reply.raw.setHeader('Cache-Control', 'no-store');
    reply.raw.on('close', () => {
      void transport.close();
      void server.close();
    });
    await transport.handleRequest(req.raw, reply.raw, req.body);
  });
  for (const method of ['GET', 'DELETE'] as const)
    app.route({
      method,
      url: '/mcp',
      handler: async (_req, reply) =>
        reply
          .code(405)
          .header('Allow', 'POST')
          .send({
            error: { code: 'METHOD_NOT_ALLOWED', message: 'Use POST para o MCP sem sessão' },
          }),
    });
}
