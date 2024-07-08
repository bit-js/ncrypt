import type { createHmac } from 'node:crypto';

/**
 * A cryptographic key
 */
export type Key = Parameters<typeof createHmac>[1];

/**
 * Represent a signer
 */
export interface Signer {
  sign: (data: string) => string;
  verify: (data: string, digest: string) => boolean;
}
