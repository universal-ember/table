import Route from '@ember/routing/route';

import rehypeShikiFromHighlighter from '@shikijs/rehype/core';
import { setupTabster } from 'ember-primitives/tabster';
import { setupKolay } from 'kolay/setup';
import { getHighlighterCore } from 'shiki/core';
import getWasm from 'shiki/wasm';

import { Callout } from '@universal-ember/docs-support';

import { APIDocs, ComponentSignature, ModifierSignature } from './api-docs.gts';
import { DATA } from '../sample-data';

export default class Application extends Route {
  async model() {
    const highlighter = await getHighlighterCore({
      themes: [import('shiki/themes/github-dark.mjs'), import('shiki/themes/github-light.mjs')],
      langs: [
        import('shiki/langs/javascript.mjs'),
        import('shiki/langs/typescript.mjs'),
        import('shiki/langs/bash.mjs'),
        import('shiki/langs/css.mjs'),
        import('shiki/langs/diff.mjs'),
        import('shiki/langs/html.mjs'),
        import('shiki/langs/glimmer-js.mjs'),
        import('shiki/langs/glimmer-ts.mjs'),
        import('shiki/langs/handlebars.mjs'),
        import('shiki/langs/jsonc.mjs'),
        import('shiki/langs/markdown.mjs'),
      ],
      loadWasm: getWasm,
    });

    const [manifest] = await Promise.all([
      setupTabster(this),
      setupKolay(this, {
        topLevelScope: {
          Callout,
          APIDocs,
          ComponentSignature,
          ModifierSignature,
        },
        resolve: {
          // this library
          '@universal-ember/table': import('@universal-ember/table'),
          '@universal-ember/table/plugins': import('@universal-ember/table/plugins'),
          '@universal-ember/table/plugins/metadata': import('@universal-ember/table/plugins/metadata'),
          '@universal-ember/table/plugins/column-resizing': import('@universal-ember/table/plugins/column-resizing'),
          '@universal-ember/table/plugins/column-reordering': import('@universal-ember/table/plugins/column-reordering'),
          '@universal-ember/table/plugins/column-visibility': import('@universal-ember/table/plugins/column-visibility'),
          '@universal-ember/table/plugins/data-sorting': import('@universal-ember/table/plugins/data-sorting'),
          '@universal-ember/table/plugins/sticky-columns': import('@universal-ember/table/plugins/sticky-columns'),
          '@universal-ember/table/plugins/row-selection': import('@universal-ember/table/plugins/row-selection'),

          '#sample-data': Promise.resolve({ DATA }),
          'docs-app/sample-data': Promise.resolve({ DATA }),

          // community libraries
          'ember-resources': import('ember-resources'),
          'tracked-built-ins': import('tracked-built-ins'),
          'ember-primitives': import('ember-primitives'),
          kolay: import('kolay'),
        },
        rehypePlugins: [
          [
            rehypeShikiFromHighlighter,
            highlighter,
            {
              // Theme chosen by CSS variables in app/css/site/shiki.css
              defaultColor: false,
              themes: {
                light: 'github-light',
                dark: 'github-dark',
              },
            },
          ],
        ],
      }),
    ]);

    return { manifest };
  }
}
