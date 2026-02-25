import { ember, extensions } from '@embroider/vite';

import { babel } from '@rollup/plugin-babel';
import rehypeShiki from '@shikijs/rehype';
import { kolay } from 'kolay/vite';
import { defineConfig } from 'vite';

export default defineConfig(() => ({
  plugins: [
    ember(),
    kolay({
      packages: ['@universal-ember/table'],
      rehypePlugins: [
        [
          rehypeShiki,
          {
            themes: {
              light: 'github-light',
              dark: 'github-dark',
            },
            defaultColor: 'light-dark()',
          },
        ],
      ],
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
