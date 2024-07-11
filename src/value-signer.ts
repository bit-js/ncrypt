import type { Signer } from './utils/types';

/**
 * Sign a value with a hash to verify later (can be used for simple cookie setups)
 */
export default class ValueSigner {
  /**
   * The current signer
   */
  public readonly signer: Signer;

  public constructor(signer: Signer) {
    this.signer = signer;
  }

  /**
   * Sign the cookie value
   * @param value - The input value
   */
  public sign(value: string): string {
    return `${value}.${this.signer.sign(value)}`;
  }

  /**
   * Return the value if the signed value is valid, `null` otherwise
   * @param value - The input cookie value
   */
  public unsign(value: string): string | null {
    const dotIdx = value.lastIndexOf('.');
    if (dotIdx === -1) return null;

    const tentativeValue = value.substring(0, dotIdx);
    return this.signer.verify(tentativeValue, value.substring(dotIdx + 1)) ? tentativeValue : null;
  }
}
