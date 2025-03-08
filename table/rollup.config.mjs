import { Addon } from '@embroider/addon-dev/rollup';
import { defineConfig } from 'rollup';
import { babel } from '@rollup/plugin-babel';

const addon = new Addon({
  srcDir: 'src',
  destDir: 'dist',
});

export default defineConfig({
  external: ['expect-type'],
  output: addon.output(),
  plugins: [
    addon.publicEntrypoints(['**/*.js']),
    addon.dependencies(),
    babel({
      extensions: ['.js', '.gjs', '.ts', '.gts'],
      babelHelpers: 'bundled',
    }),

    addon.gjs(),
    addon.declarations('declarations'),
    addon.clean(),
  ],
});
