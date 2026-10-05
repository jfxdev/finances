#!/usr/bin/env node
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
const url = process.env.FINANCES_URL;
const key = process.env.FINANCES_API_KEY;
if (!url || !key) throw new Error('Configure FINANCES_URL e FINANCES_API_KEY');
const endpoint = new URL('/mcp', url);
if (
  endpoint.protocol !== 'https:' &&
  !['localhost', '127.0.0.1', '[::1]'].includes(endpoint.hostname)
)
  throw new Error('FINANCES_URL exige HTTPS fora do localhost');
const client = new Client({ name: 'finances-stdio', version: '0.1.0' });
await client.connect(
  new StreamableHTTPClientTransport(endpoint, {
    requestInit: { headers: { Authorization: `Bearer ${key}` } },
  }),
);
const server = new Server({ name: 'finances', version: '0.1.0' }, { capabilities: { tools: {} } });
server.setRequestHandler(ListToolsRequestSchema, () => client.listTools());
server.setRequestHandler(CallToolRequestSchema, (request) => client.callTool(request.params));
await server.connect(new StdioServerTransport());
let closing = false;
async function close() {
  if (closing) return;
  closing = true;
  await server.close();
  await client.close();
}
process.on('SIGINT', () => void close());
process.on('SIGTERM', () => void close());
