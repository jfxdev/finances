import type { Config } from './config.js';

function allowedOrigins(config: Config) {
  const publicUrl = new URL(config.PUBLIC_URL);
  const origins = new Set([publicUrl.origin]);
  if (config.NODE_ENV === 'development') {
    const ports = new Set([String(config.PORT)]);
    if (['localhost', '127.0.0.1', '[::1]'].includes(publicUrl.hostname))
      ports.add(publicUrl.port || (publicUrl.protocol === 'https:' ? '443' : '80'));
    for (const host of ['localhost', '127.0.0.1', '[::1]']) {
      for (const port of ports) origins.add(new URL(`http://${host}:${port}`).origin);
    }
  }
  return origins;
}

export function isAllowedOrigin(config: Config, origin: string) {
  return allowedOrigins(config).has(origin);
}

export function isAllowedHost(config: Config, host: string | undefined) {
  return [...allowedOrigins(config)].some((origin) => new URL(origin).host === host);
}
