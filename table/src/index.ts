/********************************
 * Public API
 *******************************/
export { headlessTable, headlessTable as table } from './-private/js-helper.ts';

// Utilities
export { TablePreferences } from './-private/preferences.ts';
export { deserializeSorts, serializeSorts } from './utils.ts';

/********************************
 * Public Types
 *******************************/
export type { Column } from './-private/column.ts';
export type {
  CellContext,
  CellOptions,
  ColumnConfig,
  ColumnKey,
  HeadlessTableConfig,
  Pagination,
  PreferencesAdapter,
  TablePreferencesData as PreferencesData,
  Selection,
  TableConfig,
  TableMeta,
} from './-private/interfaces/index.ts';
export type { CellOptionsOf } from './-private/meta.ts';
export type { Row } from './-private/row.ts';
export type { Table } from './-private/table.ts';
