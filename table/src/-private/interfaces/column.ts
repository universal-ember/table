import type { BasePlugin, Plugin } from '../../plugins';
import type { Column } from '../column';
import type { Row } from '../row';
import type { ColumnOptionsFor, SignatureFrom } from './plugins';
import type { Constructor } from '../private-types';
import type { ComponentLike, ContentValue } from '@glint/template';

// Configuration context (for defining column options) - optional fields for user convenience
export interface CellConfigContext<T = unknown, OptionsType = any> {
  column?: Column<T, OptionsType>;
  row?: Row<T>;
  options?: OptionsType & CellOptions;
}

// Runtime context (for Cell components) - required fields since they're always provided
export interface CellContext<T, OptionsType = any> {
  column: Column<T, OptionsType>;
  row: Row<T>;
  options?: OptionsType & CellOptions;
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

export interface ColumnConfig<T = unknown, OptionsType = any, CellArgs = any> {
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
  value?(context: CellConfigContext<T>): ContentValue;

  /**
   * Recommended property to use for custom components for each cell per column.
   * Out-of-the-box, this property isn't used, but the provided type may be
   * a convenience for consumers of the headless table
   */
  Cell?: ComponentLike<CellArgs>;

  /**
   * The name or title of the column, shown in the column heading / th
   */
  name?: string;

  /**
   * Bag of extra properties to pass to Cell via `@options`, if desired
   */
  options?(context: CellConfigContext<T>): OptionsType;

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
