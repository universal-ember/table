import type { BasePlugin, Plugin } from '../../plugins';
import type { Column } from '../column';
import type { ExtractColumnMeta, TableTypes } from '../types.ts';
import type { Row } from '../row';
import type { ColumnOptionsFor, SignatureFrom } from './plugins';
import type { Constructor } from '../private-types';
import type { ComponentLike, ContentValue } from '@glint/template';

export interface CellContext<T, Types extends TableTypes = TableTypes> {
  column: Column<T, Types>;
  row: Row<T>;
}

type ColumnPluginOption<P = Plugin> = P extends BasePlugin
  ? [Constructor<P>, () => ColumnOptionsFor<SignatureFrom<P>>]
  : [P | Constructor<P>, () => unknown];

/**
 * What an app knows about a column, apart from how to render its cells,
 * for example alignment, or a width to use in an export.
 *
 * Empty by default. Apps declare their own keys:
 *
 * ```ts
 * declare module '@universal-ember/table' {
 *   interface ColumnMeta<T> {
 *     align?: 'left' | 'right';
 *     exportValue?: (data: T) => string;
 *   }
 * }
 * ```
 *
 * `T` is the type of each row's data. A declaration must use the same name for it.
 */
export interface ColumnMeta<T = unknown> {}

export type CellOptions = {
  /**
   * when no value is present for a given set of data for the given column config
   */
  defaultValue?: string;
} & Record<string, unknown>;

export interface ColumnConfig<
  T = unknown,
  Types extends TableTypes = TableTypes,
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
   */
  value?: (context: CellContext<T, Types>) => ContentValue;

  /**
   * Recommended property to use for custom components for each cell per column.
   * Out-of-the-box, this property isn't used, but the provided type may be
   * a convenience for consumers of the headless table
   */
  Cell?: ComponentLike<CellContext<T, Types> & { options?: CellOptions }>;

  /**
   * The name or title of the column, shown in the column heading / th
   */
  name?: string;

  /**
   * Static information about the column, read as `column.meta`.
   * Unlike `options`, it needs no row.
   */
  meta?: ExtractColumnMeta<Types, T>;

  /**
   * Bag of extra properties to pass to Cell via `@options`, if desired
   */
  options?: (context: CellContext<T, Types>) => CellOptions;

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
}

export type ColumnKey<T> = NonNullable<ColumnConfig<T>['key']>;
