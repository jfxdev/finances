import { z } from 'zod';
const schema = z.object({
  DATABASE_URL: z.string().min(1),
  MASTER_KEYS: z.string().min(1),
  ACTIVE_MASTER_KEY: z.string().default('v1'),
  SETUP_TOKEN: z.string().min(24),
  PUBLIC_URL: z.url().default('http://localhost:3000'),
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  WEB_ROOT: z.string().optional(),
});
export type Config = z.infer<typeof schema>;
export function readConfig(env = process.env): Config {
  const c = schema.parse(env);
  const keys = JSON.parse(c.MASTER_KEYS) as Record<string, string>;
  if (
    !keys[c.ACTIVE_MASTER_KEY] ||
    Object.values(keys).some(
      (k) => !/^[A-Za-z0-9+/]{43}=$/.test(k) || Buffer.from(k, 'base64').length !== 32,
    )
  )
    throw new Error('MASTER_KEYS deve conter chaves base64 de 32 bytes e a chave ativa');
  if (c.NODE_ENV === 'production' && !c.PUBLIC_URL.startsWith('https://'))
    throw new Error('PUBLIC_URL exige HTTPS em produção');
  return c;
}
