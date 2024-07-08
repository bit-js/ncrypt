import { write, file, $ } from 'bun';
import { join } from 'path';

const writeToLib = (path: string) => write(join('./lib', path), file(path));

// Write required files
await Promise.all([
  writeToLib('README.md'),
  writeToLib('package.json')
]);

await $`cd lib && npm publish --otp=${prompt('Enter NPM one-time password or 2FA code:')} --access=public`.catch((err) => process.stderr.write(err.stderr));
