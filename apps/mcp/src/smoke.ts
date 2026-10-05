// Run only against an explicitly designated, disposable installation.
import { randomUUID } from 'node:crypto';
import { UnauthorizedError } from '@modelcontextprotocol/sdk/client/auth.js';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import {
  StreamableHTTPClientTransport,
  StreamableHTTPError,
} from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
const url = process.env.MCP_TEST_URL;
if (!url || process.env.NODE_ENV !== 'test')
  throw new Error('Configure NODE_ENV=test e MCP_TEST_URL de uma instalação descartável');
async function api(
  path: string,
  method = 'GET',
  body?: unknown,
  headers: Record<string, string> = {},
) {
  const r = await fetch(`${url}/api/v1${path}`, {
    method,
    headers: { ...(body ? { 'Content-Type': 'application/json' } : {}), ...headers },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  if (!r.ok) throw new Error(`HTTP ${r.status} em ${path}`);
  return { response: r, json: await r.json() };
}
const email = `mcp-${randomUUID()}@example.test`;
const registration = await api('/auth/register', 'POST', {
  email,
  name: 'MCP validation',
  password: 'mcp-validation-password',
  setupToken: process.env.E2E_SETUP_TOKEN,
});
const cookie = registration.response.headers.get('set-cookie')!.split(';')[0];
const headers = { cookie, 'X-CSRF-Token': registration.json.csrf };
const space = (await api('/spaces', 'GET', undefined, headers)).json[0];
const category = (await api(`/spaces/${space.id}/categories`, 'GET', undefined, headers)).json
  .items[0];
const key = (
  await api(
    '/keys',
    'POST',
    {
      name: 'MCP validation',
      grants: [
        {
          spaceId: space.id,
          resource: 'expenses',
          operations: ['read', 'create', 'update', 'delete'],
        },
      ],
    },
    headers,
  )
).json;
const remote = new Client({ name: 'remote-validation', version: '1' });
const local = new Client({ name: 'stdio-validation', version: '1' });
await remote.connect(
  new StreamableHTTPClientTransport(new URL('/mcp', url), {
    requestInit: { headers: { Authorization: `Bearer ${key.secret}` } },
  }),
);
const env = Object.fromEntries(
  Object.entries(process.env).filter((e): e is [string, string] => e[1] !== undefined),
);
await local.connect(
  new StdioClientTransport({
    command: process.execPath,
    args: ['dist/main.js'],
    env: { ...env, FINANCES_URL: url, FINANCES_API_KEY: key.secret },
    stderr: 'pipe',
  }),
);
try {
  const rt = await remote.listTools(),
    lt = await local.listTools();
  if (JSON.stringify(rt.tools.map((t) => t.name)) !== JSON.stringify(lt.tools.map((t) => t.name)))
    throw new Error('Catálogos MCP divergentes');
  const data = {
    description: 'MCP validation expense',
    amount: '12.34',
    categoryId: category.id,
    dueDate: '2026-10-01',
    status: 'pending',
  };
  const created = await local.callTool({
    name: 'create_expenses',
    arguments: { spaceId: space.id, data, idempotencyKey: randomUUID() },
  });
  if (created.isError) throw new Error('Criação MCP falhou');
  const entity = JSON.parse((created.content as { text: string }[])[0].text);
  const fetched = await remote.callTool({
    name: 'get_expenses',
    arguments: { spaceId: space.id, id: entity.id },
  });
  if (fetched.isError) throw new Error('Consulta MCP falhou');
  const changed = await local.callTool({
    name: 'update_expenses',
    arguments: {
      spaceId: space.id,
      id: entity.id,
      version: entity.version,
      data: { ...entity.data, amount: '20.99' },
    },
  });
  if (changed.isError) throw new Error('Alteração MCP falhou');
  const updated = JSON.parse((changed.content as { text: string }[])[0].text);
  const removed = await remote.callTool({
    name: 'delete_expenses',
    arguments: { spaceId: space.id, id: entity.id, version: updated.version },
  });
  if (removed.isError) throw new Error('Exclusão MCP falhou');
  const denied = await local.callTool({ name: 'list_incomes', arguments: { spaceId: space.id } });
  if (!denied.isError) throw new Error('MCP ampliou permissões');
  await api(`/keys/${key.id}`, 'DELETE', undefined, headers);
  try {
    await remote.callTool({ name: 'list_expenses', arguments: { spaceId: space.id } });
    throw new Error('Revogação MCP falhou');
  } catch (e) {
    if (!(e instanceof UnauthorizedError) && !(e instanceof StreamableHTTPError && e.code === 401))
      throw e;
  }
  process.stdout.write(
    `MCP HTTP e stdio: ${rt.tools.length} ferramentas, CRUD e revogação validados.\n`,
  );
} finally {
  await local.close();
  await remote.close();
}
