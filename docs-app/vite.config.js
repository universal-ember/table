import { ember, extensions } from '@embroider/vite';

import { babel } from '@rollup/plugin-babel';
import { kolay } from 'kolay/vite';
import { defineConfig } from 'vite';

export default defineConfig(() => ({
  plugins: [
    ember(),
    kolay({
      groups: [
        {
          name: '',
          src: import.meta.resolve('./public/docs'),
        },
      ],
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
    exclude: ['content-tag', 'kolay', '@universal-ember/table'],
    // for top-level-await, etc
    esbuildOptions: {
      target: 'esnext',
    },
  },
}));
