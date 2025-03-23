import { classicEmberSupport, ember, extensions } from '@embroider/vite';

import { babel } from '@rollup/plugin-babel';
import { kolay } from 'kolay/vite';
import { defineConfig } from 'vite';

export default defineConfig(() => ({
  plugins: [
    classicEmberSupport(),
    ember(),
    kolay({
      src: 'public/docs',
      groups: [],
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
  },
  css: {
    postcss: './config/postcss.config.mjs',
  },
  optimizeDeps: {
    // a wasm-providing dependency
    exclude: ['content-tag'],
    // for top-level-await, etc
    esbuildOptions: {
      target: 'esnext',
    },
  },
}));
