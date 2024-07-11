import { createHmac, timingSafeEqual, type BinaryLike, type BinaryToTextEncoding } from 'node:crypto';
import type { Key, Signer } from './utils/types';

/**
 * Sign and verify data using a rotation credential system
 */
export default class KeyGrip implements Signer {
  /**
   * The current key list
   */
  public readonly keys: Key[];

  /**
   * The hashing algorithm used
   */
  public readonly algorithm: string;

  /**
   * The output encoding
   */
  public readonly encoding: BinaryToTextEncoding;

  public constructor(keys: Key[], algorithm?: string, encoding?: BinaryToTextEncoding) {
    this.keys = keys;
    this.algorithm = algorithm ?? 'sha256';
    this.encoding = encoding ?? 'base64url';
  }

  /**
   * Get the hash of the data for the first key
   * @param data - The input data
   */
  public sign(data: BinaryLike): string {
    return createHmac(this.algorithm, this.keys[0]).update(data).digest(this.encoding);
  }

  /**
   * Check whether the data and the digest matched
   * @param data - The input data
   * @param digest - The input digest
   * @returns a boolean indicating a matched key
   */
  public verify(data: BinaryLike, digest: string): boolean {
    const { keys, algorithm, encoding } = this;
    const digestBuf = Buffer.from(digest);

    for (let i = 0, { length } = keys; i < length; ++i) {
      const signedStr = createHmac(algorithm, keys[i]).update(data).digest(encoding);
      if (digest.length === signedStr.length && timingSafeEqual(digestBuf, Buffer.from(signedStr))) return true;
    }

    return false;
  }

  /**
   * Get the key index that matches the data
   * @param data - The input data
   * @param digest - The input digest
   * @returns the index of the matched key, `-1` if data does not match any key
   */
  public index(data: BinaryLike, digest: string): number {
    const { keys, algorithm, encoding } = this;
    const digestBuf = Buffer.from(digest);

    for (let i = 0, { length } = keys; i < length; ++i) {
      const signedStr = createHmac(algorithm, keys[i]).update(data).digest(encoding);
      if (digest.length === signedStr.length && timingSafeEqual(digestBuf, Buffer.from(signedStr))) return i;
    }

    return -1;
  }
}
