import { action, get } from '@ember/object';
import { isEmpty } from '@ember/utils';

import type { Row } from './row';
import type { Table } from './table';
import type { ContentValue } from '@glint/template';
import type {
  ColumnConfig,
  CellOptions,
  CellConfigContext,
} from './interfaces';

const DEFAULT_VALUE = '--';
const DEFAULT_VALUE_KEY = 'defaultValue';
const DEFAULT_OPTIONS = {
  [DEFAULT_VALUE_KEY]: DEFAULT_VALUE,
};

export class Column<T = unknown, OptionsType = any, CellArgs = any> {
  get Cell() {
    return this.config.Cell;
  }

  get key() {
    return this.config.key;
  }

  get name() {
    return this.config.name;
  }

  constructor(
    public table: Table<T>,
    public config: ColumnConfig<T, OptionsType, CellArgs>,
  ) {}

  @action
  getValueForRow(row: Row<T>): ContentValue {
    if (this.config.value) {
      return this.config.value({ column: this, row });
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
    const options = this.getOptionsForRow(row) as any;
    return options[DEFAULT_VALUE_KEY];
  }

  @action
  getOptionsForRow(row?: Row<T>): OptionsType & CellOptions {
    const configuredDefault = this.table.config.defaultCellValue;
    const defaults = {
      [DEFAULT_VALUE_KEY]:
        configuredDefault !== undefined ? configuredDefault : DEFAULT_VALUE,
    };

    return {
      ...defaults,
      ...this.config.options?.({ column: this, row }),
    } as OptionsType & CellOptions;
  }
}
