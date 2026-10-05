import { writeFile } from 'node:fs/promises';
import openapiTS, { astToString } from 'openapi-typescript';
import { buildApp } from './app.js';
import { resolve } from 'node:path';
const { app } = await buildApp({
  DATABASE_URL: 'postgres://unused',
  MASTER_KEYS: JSON.stringify({ v1: Buffer.alloc(32).toString('base64') }),
  ACTIVE_MASTER_KEY: 'v1',
  SETUP_TOKEN: 'generation-only-setup-token',
  PUBLIC_URL: 'http://localhost:3000',
  PORT: 3000,
  NODE_ENV: 'test',
});
try {
  await app.ready();
  const schema = app.swagger();
  await writeFile(
    resolve('../../packages/contracts/openapi.json'),
    JSON.stringify(schema, null, 2) + '\n',
  );
  await writeFile(
    resolve('../web/src/lib/api.generated.ts'),
    astToString(await openapiTS(schema as Parameters<typeof openapiTS>[0])),
  );
} finally {
  await app.close();
}
