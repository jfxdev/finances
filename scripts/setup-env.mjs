import { randomBytes } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { parseEnv } from 'node:util';
const development = process.argv[2] === '--dev';
const publicUrl = development ? 'http://localhost:5173' : process.argv[2];
if (!publicUrl || (!development && new URL(publicUrl).protocol !== 'https:'))
  throw new Error('Uso: node scripts/setup-env.mjs --dev | https://finances.seudominio.com');
if (development) {
  let existing;
  try {
    existing = parseEnv(await readFile('.env', 'utf8'));
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  if (existing) {
    if (existing.NODE_ENV !== 'development')
      throw new Error(
        'O .env existente não é de desenvolvimento. Preserve sua configuração e prepare um .env de desenvolvimento antes de usar make dev.',
      );
    process.stdout.write('Arquivo .env de desenvolvimento existente preservado.\n');
    process.exit(0);
  }
}
const password = randomBytes(32).toString('hex');
await writeFile(
  '.env',
  `POSTGRES_PASSWORD=${password}\nDATABASE_URL=postgres://finances:${password}@localhost:${development ? '54329' : '5432'}/finances\nMASTER_KEYS='${JSON.stringify({ v1: randomBytes(32).toString('base64') })}'\nACTIVE_MASTER_KEY=v1\nSETUP_TOKEN=${randomBytes(32).toString('base64url')}\nPUBLIC_URL=${new URL(publicUrl).origin}\nNODE_ENV=${development ? 'development' : 'production'}\nPORT=3000\nAPP_PORT=3000\n${development ? 'DEV_DB_PORT=54329\n' : ''}`,
  { flag: 'wx', mode: 0o600 },
);
process.stdout.write(
  development
    ? 'Arquivo .env de desenvolvimento criado com segredos aleatórios.\n'
    : 'Arquivo .env criado com segredos aleatórios. Guarde uma cópia segura e configure seu proxy HTTPS.\n',
);
