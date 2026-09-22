import type { Column } from './column.ts';
import type { TableTypeSlots } from './types.ts';
import type { CellContext, CellOptions, ColumnConfig } from './interfaces';
import type { Row } from './row.ts';
import type { ComponentLike } from '@glint/template';

/**
 * The args of a `Cell` that is given `@options`, when rendered as
 * `<column.Cell @row={{row}} @column={{column}} @options={{column.getOptionsForRow row}} />`
 */
export interface CellArgs<
  T,
  Options extends CellOptions = CellOptions,
  TableTypes extends TableTypeSlots = TableTypeSlots,
> {
  column: Column<T, TableTypes>;
  row: Row<T>;
  options: Options;
}

/**
 * A column config where the `Cell` and the `options` must agree.
 */
export type TypedColumnConfig<
  T,
  Options extends CellOptions,
  TableTypes extends TableTypeSlots = TableTypeSlots,
> = Omit<ColumnConfig<T, TableTypes>, 'Cell' | 'options'> & {
  Cell?: ComponentLike<CellArgs<T, Options, TableTypes>>;
  options?: (context: CellContext<T, TableTypes>) => Options;
};

/**
 * Checks each column's `Cell` against that column's own `options`.
 *
 * ```ts
 * const col = column<Person>();
 *
 * headlessTable(this, {
 *   columns: () => [
 *     col({ key: 'name' }),
 *     col({ key: 'age', Cell: UnitCell, options: () => ({ unit: 'years' }) }),
 *   ],
 * });
 * ```
 *
 * `T` is given first and `Options` is inferred per call,
 * because TypeScript cannot infer only some of a function's type arguments.
 */
export function column<
  T,
  TableTypes extends TableTypeSlots = TableTypeSlots,
>() {
  return <Options extends CellOptions>(
    config: TypedColumnConfig<T, Options, TableTypes>,
  ): ColumnConfig<T, TableTypes> => {
    // `Options` is only known per column, and a list of columns has one element type.
    // The check has happened by here, so the list can hold the general type.
    return config as unknown as ColumnConfig<T, TableTypes>;
  };
}
