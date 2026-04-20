import { createHash } from 'crypto';

export function hashPassword(raw: string): string {
  return createHash('sha256').update(raw + (process.env.PASSWORD_SALT ?? 'humansoftech_salt')).digest('hex');
}
