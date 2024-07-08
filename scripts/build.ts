import { existsSync, rmSync } from 'fs';
import pkg from '../package.json';
import { $, Glob } from 'bun';

// Generating types
const outdir = './lib';
if (existsSync(outdir)) rmSync(outdir, { recursive: true });

// Build source files
Bun.build({
    format: 'esm',
    target: 'bun',
    outdir,
    entrypoints: [...new Glob('src/*.ts').scanSync('.')],
    minify: { whitespace: true },
    // @ts-ignore
    external: Object.keys(pkg.dependencies ?? {})
});

await $`bun x tsc`;
