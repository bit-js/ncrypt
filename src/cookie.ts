import type { Signer } from './utils/types';

export type CookieValue = string | number | null;

export class CookiePair {
  public readonly key: string;
  public value?: CookieValue;
  public signer?: Signer;

  public domain?: string;
  public expires?: Date;
  public httpOnly?: boolean;
  public maxAge?: number;
  public partitioned?: boolean;
  public path?: string;
  public secure?: boolean;
  public sameSite?: 'Strict' | 'Lax' | 'None';

  public constructor(key: string) {
    this.key = key;
  }

  public serialize(): string {
    const { value } = this;
    if (value === null)
      return `${this.key}=; Max-Age=0${typeof this.domain === 'string' ? `; Domain=${this.domain}` : ''}${typeof this.path === 'string' ? `; Path=${this.path}` : ''}`;

    const { signer } = this;
    // eslint-disable-next-line
    return `${this.key}=${value ?? ''}${typeof signer === 'undefined' ? '' : '.' + signer.sign(typeof value === 'string' ? value : '' + value)}${typeof this.domain === 'string' ? `; Domain=${this.domain}` : ''}${this.expires instanceof Date ? `; Expires=${this.expires.toUTCString()}` : ''}${this.httpOnly === true ? '; HttpOnly' : ''}${typeof this.maxAge === 'number' ? `; Max-Age=${this.maxAge}` : ''}${this.partitioned === true ? '; Partitioned' : ''}${typeof this.path === 'string' ? `; Path=${this.path}` : ''}${this.secure === true ? '; Secure' : ''}${typeof this.sameSite === 'string' ? `; SameSite=${this.sameSite}` : ''}`
  }
}

const reactiveCookieHandler: ProxyHandler<Record<string, CookiePair>> = {
  // eslint-disable-next-line
  get: (target, p: string) => target[p] ??= new CookiePair(p)
};

/**
 * Wrap the current pairs in a `Proxy` that allows new pairs to be created. This also means it can change the original pairs object
 */
export function reactiveCookie<Pairs extends Record<string, CookiePair>>(pairs: Pairs): Pairs & Record<string, CookiePair> {
  return new Proxy(pairs, reactiveCookieHandler) as any;
}

/**
 * Append all cookie pairs in the object to the target `Headers` object
 * @param headers - The target `Headers` object
 * @param cookies - The object that contains cookie pairs
 */
export function appendToHeaders(headers: Headers, cookies: Record<string, CookiePair>): void {
  for (const key in cookies) headers.append('Set-Cookie', cookies[key].serialize());
}
