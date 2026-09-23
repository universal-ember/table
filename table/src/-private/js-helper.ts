import { assert } from '@ember/debug';

import { Table } from './table.ts';

import type { HeadlessTableConfig, TableConfig } from './interfaces';
import type { CellArgsOf, ColumnMetaOf } from './meta.ts';

/**
 * Represents a UI-less version of a table
 *
 * _For use for building tables in ui frameworks_.
 *
 * The first argument is the object that owns the table.
 * The table is destroyed with that object, and uses that object's owner.
 *
 * @example
 * ```js
 * import { headlessTable } '@universal-ember/table';
 *
 * class MyImplementation {
 *   table = headlessTable(this, {
 *     // your config here
 *   })
 * }
 * ```
 *
 */
export function headlessTable<
  T = unknown,
  const ColumnMetas extends unknown[] = unknown[],
  Meta = unknown,
  Columns extends readonly unknown[] = readonly unknown[],
>(
  parent: object,
  options: HeadlessTableConfig<T, ColumnMetas, Meta, Columns>,
): Table<T, ColumnMetaOf<ColumnMetas>, Meta, CellArgsOf<Columns>> {
  assert(
    `headlessTable requires a parent object as the first argument, usually \`this\`. ` +
      `The single-argument form was removed, because the table is no longer a Resource.`,
    options,
  );

  // The meta types only shape what the table returns, so they come from the return type.
  return new Table(parent, options as TableConfig<T, Meta>);
}
