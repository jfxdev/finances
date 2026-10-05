import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  createHash,
  timingSafeEqual,
} from 'node:crypto';
export type Envelope = { nonce: string; tag: string; ciphertext: string };
export function encrypt(key: Buffer, context: string, value: unknown): Envelope {
  const nonce = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key, nonce);
  cipher.setAAD(Buffer.from(context));
  const ciphertext = Buffer.concat([cipher.update(JSON.stringify(value), 'utf8'), cipher.final()]);
  return {
    nonce: nonce.toString('base64'),
    tag: cipher.getAuthTag().toString('base64'),
    ciphertext: ciphertext.toString('base64'),
  };
}
export function decrypt<T>(key: Buffer, context: string, value: Envelope): T {
  const cipher = createDecipheriv('aes-256-gcm', key, Buffer.from(value.nonce, 'base64'));
  cipher.setAAD(Buffer.from(context));
  cipher.setAuthTag(Buffer.from(value.tag, 'base64'));
  return JSON.parse(
    Buffer.concat([
      cipher.update(Buffer.from(value.ciphertext, 'base64')),
      cipher.final(),
    ]).toString('utf8'),
  ) as T;
}
export const secret = () => randomBytes(32).toString('base64url');
export const hash = (s: string) => createHash('sha256').update(s).digest('hex');
export function equalSecret(a: string, b: string) {
  return timingSafeEqual(Buffer.from(hash(a)), Buffer.from(hash(b)));
}
