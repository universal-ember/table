import type { BasePlugin, Plugin } from '../../plugins';
import type { Column } from '../column';
import type { Row } from '../row';
import type { Table } from '../table';
import type { ColumnOptionsFor, SignatureFrom } from './plugins';
import type { Constructor } from '../private-types';
import type { ComponentLike, ContentValue } from '@glint/template';

declare const rowType: unique symbol;

/**
 * What `value`, `options`, and a `Cell` receive.
 *
 * `ColumnMeta` is the `meta` of the column,
 * and `Meta` is the `meta` of the table config.
 */
export interface CellContext<T, out ColumnMeta = unknown, out Meta = unknown> {
  column: Column<T, ColumnMeta, Meta, any>;
  /**
   * The row, whose `table` has the meta types of this table.
   */
  row: Row<T> & { table: Table<T, ColumnMeta, Meta, any> };
}

type ColumnPluginOption<P = Plugin> = P extends BasePlugin
  ? [Constructor<P>, () => ColumnOptionsFor<SignatureFrom<P>>]
  : [P | Constructor<P>, () => unknown];

export type CellOptions = {
  /**
   * when no value is present for a given set of data for the given column config
   */
  defaultValue?: string;
} & Record<string, unknown>;

/**
 * `CellArgs` are the args a `Cell` takes besides `@row` and `@column`,
 * passed where the cell is rendered.
 */
export interface ColumnConfig<
  T = unknown,
  ColumnMeta = unknown,
  Meta = unknown,
  CellArgs = unknown,
> {
  /**
   * the `key` is required for preferences storage, as well as
   * managing uniqueness of the columns in an easy-to-understand way.
   *
   * key may be anything if a `value` is provided, but _should_
   * be a property-path on each data object passed to the table.
   *
   * @example `someObj.property.path`
   * @example `someProperty`
   */
  key: string;

  /**
   * Optionally provide a function to determine the value of a row at this column
   *
   * `column.meta` is `unknown` here, and in `options`.
   * Typed with the column meta, it would be `any`:
   * TypeScript takes the type from the plain column list in `HeadlessTableConfig`,
   * where the column meta is `any`.
   */
  value?: (context: CellContext<T, unknown, NoInfer<Meta>>) => ContentValue;

  /**
   * Recommended property to use for custom components for each cell per column.
   * Out-of-the-box, this property isn't used, but the provided type may be
   * a convenience for consumers of the headless table
   */
  Cell?: ComponentLike<
    CellContext<T, NoInfer<ColumnMeta>, NoInfer<Meta>> & CellArgs
  >;

  /**
   * The name or title of the column, shown in the column heading / th
   */
  name?: string;

  /**
   * Information about the column that is not tied to a row,
   * for example the alignment of its cells.
   *
   * Read it back as `column.meta`.
   * Its type is inferred from what the columns config provides.
   */
  meta?: ColumnMeta;

  /**
   * Bag of extra properties to pass to Cell via `@options`, if desired
   */
  options?: (context: CellContext<T, unknown, NoInfer<Meta>>) => CellOptions;

  /**
   * Each plugin may provide column options, and provides similar syntax to how
   * options for the table are specified in the plugins entry,
   *
   * ```js
   * pluginOptions: [
   *   ColumnVisibility.forColumn(() => ({ isVisible: false })),
   *   StickyColumns.forColumn(() => ({ sticky: 'right' })),
   * ],
   * ```
   */
  pluginOptions?: ColumnPluginOption[];

  /**
   * Type-only, never set.
   *
   * Without a direct mention of `T`, a list typed `ColumnConfig[]`
   * gives `headlessTable` a row type that depends on the order TypeScript checks the program in.
   */
  readonly [rowType]?: T;
}

export type ColumnKey<T> = NonNullable<ColumnConfig<T>['key']>;
