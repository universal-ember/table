import { assert } from '@ember/debug';

import { Table } from './table.ts';

import type { TableConfig } from './interfaces';

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
export function headlessTable<T = unknown>(
  parent: object,
  options: TableConfig<T>,
): Table<T> {
  assert(
    `headlessTable requires a parent object as the first argument, usually \`this\`. ` +
      `The single-argument form was removed, because the table is no longer a Resource.`,
    options,
  );

  return new Table<T>(parent, options);
}
