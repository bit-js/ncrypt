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

### BasicSigner

A simple single key signer and verifier.

```ts
import BasicSigner from "@bit-js/ncrypt/basic-signer";

const signer = new BasicSigner("secret");

// Return the signed value
signer.sign(value);

// Return whether the hash matches the value
signer.verify(value, hash);
```

### ValueSigner

Sign a value and verify it later.

```ts
import ValueSigner from "@bit-js/ncrypt/value-signer";

// Pass in a signer (choose one above) for signing and unsigning a value
const valueSigner = new ValueSigner(signer);

// Sign a value
const signedValue = valueSigner.sign("hi there"); // "hi there.[hash]"

// Get the original value if the hash matches, otherwise return null
const originalValue = valueSigner.unsign(signedValue); // "hi there"
```

## Cookie

Cookie utilities.

### CookiePair

Use a cookie pair to send cookie

```ts
import { CookiePair } from "@bit-js/ncrypt/cookie";

// Initialize a cookie pair (key is required)
const pair = new CookiePair("id");

// Set the cookie value (optional)
pair.value = 0;

// Set a signer to sign the cookie value (optional)
pair.signer = signer;

// Set cookie expire date (optional)
pair.expires = new Date();

// Set cookie max age (optional)
pair.maxAge = 3600000;

// Whether cookie is accessible through client-side JS (optional)
pair.httpOnly = true;

// Indicates that the cookie should be stored using partitioned storage (optional)
pair.partitioned = true;

// Defines the host to which the cookie will be sent (optional)
pair.domain = domain;

// Indicates the path that must exist in the requested URL for the browser to send the header (optional)
pair.path = path;

// Indicates that the cookie is sent to the server only when a request is made with the https scheme (optional)
pair.secure = true;

// Controls whether or not a cookie is sent with cross-site requests (optional)
pair.sameSite = "Strict";

// Serialize the cookie to string
pair.serialize();
```

If the pair value is set to `null`, `pair.serialize()` will produce a cookie that lasts 0 second and only contains the `domain` and `path` if provided.

### Reactive cookie

If you think this is a good idea then I guess ¯\_(ツ)\_/¯.

```ts
import { reactiveCookie, appendToHeaders } from "@bit-js/ncrypt/cookie";

// Create a Proxy over the original object
const cookie = reactiveCookie({});

// Every property is a cookie pair
const { id } = cookie;
id.value = 0;
id.sameSite = "Strict";

// Append all the pair values to a Headers object
appendToHeaders(new Headers(), cookie);
```
