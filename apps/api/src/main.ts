import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import fastifyStatic from '@fastify/static';
import { buildApp } from './app.js';
import { readConfig } from './config.js';
import { migrate } from './migrate.js';
const config = readConfig();
await migrate(config.DATABASE_URL);
const { app, service } = await buildApp(config, true);
const root = resolve(config.WEB_ROOT ?? '../web/dist');
if (existsSync(root)) {
  await app.register(fastifyStatic, {
    root,
    index: ['index.html'],
    setHeaders: (res, path) => {
      if (
        path.endsWith('index.html') ||
        path.endsWith('sw.js') ||
        path.endsWith('manifest.webmanifest')
      )
        res.setHeader('Cache-Control', 'no-cache');
      if (path.endsWith('index.html'))
        res.setHeader(
          'Content-Security-Policy',
          "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; font-src 'self'; frame-ancestors 'none'",
        );
    },
  });
  app.setNotFoundHandler((req, reply) => {
    if (req.url.startsWith('/api') || req.url.startsWith('/mcp') || req.method !== 'GET')
      return reply.code(404).send({ error: { code: 'NOT_FOUND', message: 'Rota não encontrada' } });
    return reply
      .header('Cache-Control', 'no-cache')
      .header(
        'Content-Security-Policy',
        "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; font-src 'self'; frame-ancestors 'none'",
      )
      .sendFile('index.html');
  });
}
await service.verifyKeys();
await app.listen({ port: config.PORT, host: config.NODE_ENV === 'test' ? '127.0.0.1' : '0.0.0.0' });
let generating = false;
async function generate() {
  if (generating) return;
  generating = true;
  try {
    await service.generate();
  } catch {
    app.log.error('Falha na geração de recorrências');
  } finally {
    generating = false;
  }
}
void generate();
const timer = setInterval(() => void generate(), 60000);
async function close() {
  clearInterval(timer);
  await app.close();
}
process.on('SIGINT', () => void close());
process.on('SIGTERM', () => void close());
