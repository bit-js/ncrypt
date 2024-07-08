import type { Key, Signer } from './utils/types';
import { createHmac, timingSafeEqual, type BinaryToTextEncoding, type BinaryLike } from 'node:crypto';

export default class KeySigner implements Signer {
  /**
   * The current key
   */
  public readonly key: Key;

  /**
   * The hashing algorithm used
   */
  public readonly algorithm: string;

  /**
   * The output encoding
   */
  public readonly encoding: BinaryToTextEncoding;

  public constructor(key: Key, algorithm?: string, encoding?: BinaryToTextEncoding) {
    this.key = key;
    this.algorithm = algorithm ?? 'sha256';
    this.encoding = encoding ?? 'base64url';
  }

  /**
   * Get the hash of the data for the key
   * @param data - The input data
   */
  public sign(data: BinaryLike): string {
    return createHmac(this.algorithm, this.key).update(data).digest(this.encoding);
  }

  /**
   * Check whether the data and the digest matched
   * @param data - The input data
   * @param digest - The input digest
   */
  public verify(data: BinaryLike, digest: string): boolean {
    const signedStr = createHmac(this.algorithm, this.key).update(data).digest(this.encoding);
    return signedStr.length === digest.length && timingSafeEqual(Buffer.from(signedStr), Buffer.from(digest));
  }
}
