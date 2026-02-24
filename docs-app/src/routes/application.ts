import Route from '@ember/routing/route';

import rehypeShikiFromHighlighter from '@shikijs/rehype/core';
import { setupTabster } from 'ember-primitives/tabster';
import { setupKolay } from 'kolay/setup';
import { createOnigurumaEngine } from 'shiki/engine/oniguruma';
import { createHighlighterCore } from 'shiki/core';

import { Callout } from '@universal-ember/docs-support';

import { APIDocs, ComponentSignature, ModifierSignature } from './api-docs.gts';
import { DATA } from '../sample-data';

export default class Application extends Route {
  async model() {
    const highlighter = await createHighlighterCore({
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
      engine: createOnigurumaEngine(import('shiki/wasm')),
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
        modules: {
          // this library
          '@universal-ember/table': () => import('@universal-ember/table'),
          '@universal-ember/table/plugins': () => import('@universal-ember/table/plugins'),
          '@universal-ember/table/plugins/metadata': () => import('@universal-ember/table/plugins/metadata'),
          '@universal-ember/table/plugins/column-resizing': () => import('@universal-ember/table/plugins/column-resizing'),
          '@universal-ember/table/plugins/column-reordering': () => import('@universal-ember/table/plugins/column-reordering'),
          '@universal-ember/table/plugins/column-visibility': () => import('@universal-ember/table/plugins/column-visibility'),
          '@universal-ember/table/plugins/data-sorting': () => import('@universal-ember/table/plugins/data-sorting'),
          '@universal-ember/table/plugins/sticky-columns': () => import('@universal-ember/table/plugins/sticky-columns'),
          '@universal-ember/table/plugins/row-selection': () => import('@universal-ember/table/plugins/row-selection'),

          '#sample-data': () => ({ DATA }),
          'docs-app/sample-data': () => ({ DATA }),

          // community libraries
          'ember-resources': () => import('ember-resources'),
          'tracked-built-ins': () => import('tracked-built-ins'),
          'ember-primitives': () => import('ember-primitives'),
          'reactiveweb/fps': () => import('reactiveweb/fps'),
          'reactiveweb/map': () => import('reactiveweb/map'),
          // @ts-expect-error no types
          '@html-next/vertical-collection': () => import('@html-next/vertical-collection'),
          kolay: () => import('kolay'),
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
