import { ember, extensions } from '@embroider/vite';

import { babel } from '@rollup/plugin-babel';
import { kolay } from 'kolay/vite';
import { createRequire } from 'module';
import path from 'path';
import { defineConfig } from 'vite';

const _require = createRequire(import.meta.url);

// ember-raf-scheduler v0.3 ships only a CJS ember-addon index.js (no ESM exports),
// so vite's pre-bundler generates `window.require(...)` which breaks in the browser.
// Alias it to the actual ESM source that @html-next/vertical-collection needs.
const vcMain = _require.resolve('@html-next/vertical-collection');
const vcNodeModules = path.dirname(
  path.dirname(path.dirname(path.dirname(vcMain))),
);
const emberRafSchedulerAddon = path.join(
  vcNodeModules,
  'ember-raf-scheduler',
  'addon',
  'index.js',
);

export default defineConfig(() => ({
  plugins: [
    ember(),
    kolay({
      packages: ['@universal-ember/table'],
    }),
    babel({
      babelHelpers: 'runtime',
      extensions,
    }),
  ],
  build: {
    sourcemap: true,
    minify: 'terser',
    target: ['esnext'],
  },
  resolve: {
    extensions,
    alias: {
      'ember-raf-scheduler': emberRafSchedulerAddon,
    },
  },
  css: {
    postcss: './config/postcss.config.mjs',
  },
  optimizeDeps: {
    // a wasm-providing dependency
    exclude: [
      'content-tag',
      '@universal-ember/table',
      '@universal-ember/docs-support',
    ],
    include: ['@shikijs/rehype', 'shiki'],
    // for top-level-await, etc
    esbuildOptions: {
      target: 'esnext',
    },
  },
}));
