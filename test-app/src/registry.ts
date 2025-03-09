import Router from './router.ts';
import config from '#config';

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
};

export const registry = {
  ...resolverRegistry,
};
