import type { Column } from './column.ts';
import type { CellContext, CellOptions, ColumnConfig } from './interfaces';
import type { Row } from './row.ts';
import type { ComponentLike } from '@glint/template';

/**
 * The args of a `Cell` that is given `@options`, when rendered as
 * `<column.Cell @row={{row}} @column={{column}} @options={{column.getOptionsForRow row}} />`
 */
export interface CellArgs<T, Options extends CellOptions = CellOptions> {
  column: Column<T>;
  row: Row<T>;
  options: Options;
}

/**
 * A column config where the `Cell` and the `options` must agree.
 */
export type TypedColumnConfig<T, Options extends CellOptions> = Omit<
  ColumnConfig<T>,
  'Cell' | 'options'
> & {
  Cell?: ComponentLike<CellArgs<T, Options>>;
  options?: (context: CellContext<T>) => Options;
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
export function column<T>() {
  return <Options extends CellOptions>(
    config: TypedColumnConfig<T, Options>,
  ): ColumnConfig<T> => {
    // `Options` is only known per column, and a list of columns has one element type.
    // The check has happened by here, so the list can hold the general type.
    return config as unknown as ColumnConfig<T>;
  };
}
