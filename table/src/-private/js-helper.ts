import { Table } from './table.ts';

import type { TableConfig, CellContext } from './interfaces';

type Args<DataType, OptionsType = any, CellArgs = any> =
  | [destroyable: object, options: TableConfig<DataType, OptionsType, CellArgs>]
  | [options: TableConfig<DataType, OptionsType, CellArgs>];

/**
 * Represents a UI-less version of a table
 *
 * _For use for building tables in ui frameworks_.
 *
 * @example
 * ```js
 * import { use } from 'ember-resources';
 * import { headlessTable } '@universal-ember/table';
 *
 * class MyImplementation {
 *   @use table = headlessTable({
 *     // your config here
 *   })
 * }
 * ```
 */
export function headlessTable<DataType = unknown, OptionsType = any, CellArgs = any>(
  options: TableConfig<DataType, OptionsType, CellArgs>,
): Table<DataType, OptionsType, CellArgs>;

/**
 * Represents a UI-less version of a table
 *
 * _For use for building tables in ui frameworks_.
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
export function headlessTable<DataType = unknown, OptionsType = any, CellArgs = any>(
  destroyable: object,
  options: TableConfig<DataType, OptionsType, CellArgs>,
): Table<DataType, OptionsType, CellArgs>;

export function headlessTable<DataType = unknown, OptionsType = any, CellArgs = any>(
  ...args: Args<DataType, OptionsType, CellArgs>
): Table<DataType, OptionsType, CellArgs> {
  if (args.length === 2) {
    const [destroyable, options] = args;

    /**
     * If any "root level" config changes, we need to throw-away everything.
     * otherwise individual-property reactivity can be managed on a per-property
     * "thunk"-basis
     */
    return Table.from<Table<DataType, OptionsType, CellArgs>>(
      destroyable,
      () => options,
    );
  }

  const [options] = args;

  return Table.from<Table<DataType, OptionsType, CellArgs>>(() => options);
}
