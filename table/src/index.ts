/********************************
 * Public API
 *******************************/
export { column } from './-private/column-helper.ts';
export { tableTypes } from './-private/types.ts';
export { headlessTable, headlessTable as table } from './-private/js-helper.ts';

// Utilities
export { TablePreferences } from './-private/preferences.ts';
export { deserializeSorts, serializeSorts } from './utils.ts';

/********************************
 * Public Types
 *******************************/
export type { Column } from './-private/column.ts';
export type { CellArgs, TypedColumnConfig } from './-private/column-helper.ts';
export type {
  ExtractColumnMeta,
  ExtractTableMeta,
  TableTypes,
} from './-private/types.ts';
export type {
  CellContext,
  CellOptions,
  ColumnConfig,
  ColumnMeta,
  ColumnKey,
  Pagination,
  PreferencesAdapter,
  TablePreferencesData as PreferencesData,
  Selection,
  TableConfig,
  TableMeta,
} from './-private/interfaces/index.ts';
export type { Row } from './-private/row.ts';
export type { Table } from './-private/table.ts';
