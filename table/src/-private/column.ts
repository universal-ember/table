import { action, get } from '@ember/object';
import { isEmpty } from '@ember/utils';

import type { CellComponent } from './cell-component.ts';
import type { Row } from './row';
import type { Table } from './table';
import type { ComponentLike, ContentValue } from '@glint/template';
import type { CellContext, ColumnConfig } from './interfaces';
import type { CellOptionsOf } from './meta.ts';

const DEFAULT_VALUE = '--';
const DEFAULT_VALUE_KEY = 'defaultValue';
const DEFAULT_OPTIONS = {
  [DEFAULT_VALUE_KEY]: DEFAULT_VALUE,
};

/**
 * `ColumnMeta` is the type of `meta`, and `Meta` the type of `table.config.meta`.
 * `CellArgs` are the args of `Cell` besides `@row` and `@column`.
 *
 * `config` and `Cell` do not carry the column meta,
 * so that a column fits wherever a column with a wider meta is expected.
 */
export class Column<
  T = unknown,
  ColumnMeta = unknown,
  Meta = unknown,
  CellArgs = unknown,
> {
  get Cell():
    | CellComponent<CellContext<T, unknown, any> & CellArgs>
    | undefined {
    return this.config.Cell as
      | CellComponent<CellContext<T, unknown, any> & CellArgs>
      | undefined;
  }

  get key(): string {
    return this.config.key;
  }

  get name(): string | undefined {
    return this.config.name;
  }

  get meta(): ColumnMeta | undefined {
    return this.config.meta as ColumnMeta | undefined;
  }

  constructor(
    public table: Table<T, ColumnMeta, Meta, CellArgs>,
    public config: ColumnConfig<T, unknown, Meta>,
  ) {}

  @action
  getValueForRow(row: Row<T>): ContentValue {
    if (this.config.value) {
      return this.config.value(this.#contextFor(row));
    }

    // Cast here, because ember get's types do not support nested keys
    // even though the real implementation does
    const value = get(row.data, this.config.key);

    if (isEmpty(value)) {
      return this.getDefaultValue(row);
    }

    /**
     * UNSAFE: casting to ContentValue is incorrect, because we have not
     *         properly constrained the type of value, (isEmpty doesn't narrow types either)
     */
    return value as ContentValue;
  }

  private getDefaultValue(row: Row<T>) {
    return this.getOptionsForRow(row)[DEFAULT_VALUE_KEY];
  }

  /**
   * What to pass a Cell as `@options`:
   * the default value, and what the column's `options` returns.
   *
   * The type also has the `@options` the table's Cells ask for.
   * The column's `options` must return them: this is not checked.
   */
  @action
  getOptionsForRow(
    row: Row<T>,
  ): { defaultValue: string } & CellOptionsOf<CellArgs> {
    const configuredDefault = this.table.config.defaultCellValue;
    const defaults = {
      [DEFAULT_VALUE_KEY]:
        configuredDefault !== undefined ? configuredDefault : DEFAULT_VALUE,
    };

    return {
      ...defaults,
      ...this.config.options?.(this.#contextFor(row)),
    } as { defaultValue: string } & CellOptionsOf<CellArgs>;
  }

  #contextFor(row: Row<T>): CellContext<T, unknown, Meta> {
    // The row is a row of this column's table, so its table has this table's types.
    return { column: this, row } as CellContext<T, unknown, Meta>;
  }
}
