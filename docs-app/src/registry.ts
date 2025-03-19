import Router from './router.ts';
import config from '#config';
import PageTitle from 'ember-page-title/services/page-title';
import APIDocs from 'kolay/services/kolay/api-docs';
import Compiler from 'kolay/services/kolay/compiler';
import Docs from 'kolay/services/kolay/docs';
import Selected from 'kolay/services/kolay/selected';

function formatAsResolverEntries(imports: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(imports).map(([k, v]) => [
      k.replace(/\.g?(j|t)s$/, '').replace(/^\.\//, `${config.modulePrefix}/`),
      v,
    ]),
  );
}

/**
 * A global registry is needed until:
 * - Services can be referenced via import paths (rather than strings)
 * - we design a new routing system
 */
const resolverRegistry = {
  ...formatAsResolverEntries(
    import.meta.glob('./templates/**/*.{gjs,gts,js,ts}', { eager: true }),
  ),
  ...formatAsResolverEntries(
    import.meta.glob('./services/**/*.{js,ts}', { eager: true }),
  ),
  ...formatAsResolverEntries(
    import.meta.glob('./routes/**/*.{js,ts}', { eager: true }),
  ),
  [`${config.modulePrefix}/router`]: Router,
  [`${config.modulePrefix}/services/kolay/api-docs`]: APIDocs,
  [`${config.modulePrefix}/services/kolay/compiler`]: Compiler,
  [`${config.modulePrefix}/services/kolay/docs`]: Docs,
  [`${config.modulePrefix}/services/kolay/selected`]: Selected,
  [`${config.modulePrefix}/services/page-title`]: PageTitle,
};

export const registry = {
  ...resolverRegistry,
};
