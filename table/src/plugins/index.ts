// Public API
export {
  BasePlugin,
  columns,
  hasPlugin,
  meta,
  options,
  preferences,
} from './-private/base.ts';
export { applyStyles, removeStyles } from './-private/utils.ts';

// Public Types
export type { ColumnFeatures, TableFeatures } from './-private/base.ts';
export type {
  ColumnApi,
  Plugin,
  PluginPreferences,
  Registry,
} from '#interfaces';
export type { PluginSignature } from '#interfaces/plugins';
