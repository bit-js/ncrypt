# NCrypt

Fast node crypto utilities.

## Signers

Signers are instances that can be used to sign and verify data.

```ts
// The data can be anything depending on the specific signer
interface Signer {
  sign: (data: string) => string;
  verify: (data: string, digest: string) => boolean;
}
```

### KeyGrip

A fast drop-in replacement of the `keygrip` module.

```ts
import KeyGrip from "@bit-js/ncrypt/key-grip";
```

### KeySigner

A simple key signer and verifier.

```ts
import KeySigner from "@bit-js/ncrypt/key-signer";
```

### CookieSigner

`CookieSigner` is a fast replacement of `node-cookie-signature`.

This class does not implements the `Signer` interface and instead rely on a `Signer` to handle the process.

```ts
import CookieSigner from "@bit-js/ncrypt/cookie-signer";

const cookieSigner = new CookieSigner(signerInstance);
cookieSigner.sign("cookieValue"); // Sign a cookie value using the passed in signer
cookieSigner.verify("signedValue"); // Verify and return the signed value if matches, null otherwise
```
