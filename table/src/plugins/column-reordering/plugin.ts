import { cached, tracked } from '@glimmer/tracking';
import { assert } from '@ember/debug';
import { action } from '@ember/object';

import { TrackedMap } from 'tracked-built-ins';

import { preferences } from '../../plugins/index.ts';

import { BasePlugin, columns, meta } from '../-private/base.ts';

import type { PluginPreferences } from '../../plugins/index.ts';
import type { Column, Table } from '../../index.ts';

interface ColumnReorderingPreferences extends PluginPreferences {
  table: {
    order?: Record<string, number>;
  };
}

declare module '@universal-ember/table/plugins' {
  interface Registry {
    ColumnReordering?: ColumnReorderingPreferences;
    'column-reordering'?: ColumnReorderingPreferences;
  }
}

export interface Signature {
  Meta: {
    Column: ColumnMeta;
    Table: TableMeta;
  };
}

export class ColumnReordering extends BasePlugin<Signature> {
  name = 'column-reordering';
  static features = ['columnOrder'];

  meta = {
    column: ColumnMeta,
    table: TableMeta,
  } as const;

  reset() {
    const tableMeta = meta.forTable(this.table, ColumnReordering);

    tableMeta.reset();
  }

  get columns() {
    return meta.forTable(this.table, ColumnReordering).columns;
  }
}

export class ColumnMeta {
  constructor(private column: Column) {}

  get #tableMeta() {
    return meta.forTable(this.column.table, ColumnReordering);
  }

  get position() {
    return this.#tableMeta.getPosition(this.column);
  }

  set position(value: number) {
    this.#tableMeta.setPosition(this.column, value);
  }

  get canMoveLeft() {
    return this.#tableMeta.getPosition(this.column) !== 0;
  }

  get canMoveRight() {
    return (
      this.#tableMeta.getPosition(this.column) !==
      this.#tableMeta.columns.length - 1
    );
  }

  get cannotMoveLeft() {
    return !this.canMoveLeft;
  }

  get cannotMoveRight() {
    return !this.canMoveRight;
  }

  /**
   * Move the column one spot to the left
   */
  moveLeft = () => {
    this.#tableMeta.columnOrder.moveLeft(this.column.key);
  };

  /**
   * Move the column one spot to the right
   */
  moveRight = () => {
    this.#tableMeta.columnOrder.moveRight(this.column.key);
  };
}

export class TableMeta {
  constructor(private table: Table) {}

  /**
   * @private
   *
   * We want to maintain the instance of this ColumnOrder class because
   * we allow the consumer of the table to swap out columns at any time.
   * When they do this, we want to maintain the order of the table, best we can.
   * This is also why the order of the columns is maintained via column key
   */
  @tracked
  columnOrder = new ColumnOrder({
    columns: () => this.availableColumns,
    save: this.save,
    existingOrder: this.read(),
  });

  /**
   * Get the curret order/position of a column
   */
  @action
  getPosition(column: Column) {
    return this.columnOrder.get(column.key);
  }

  /**
   * Swap the column with the column at `newPosition`
   */
  @action
  setPosition(column: Column, newPosition: number) {
    return this.columnOrder.swapWith(column.key, newPosition);
  }

  /**
   * Using a `ColumnOrder` instance, set the order of all columns
   */
  setOrder = (order: ColumnOrder) => {
    this.columnOrder.setAll(order.map);
  };

  /**
   * Revert to default config, delete preferences,
   * and clear the columnOrder
   */
  @action
  reset() {
    preferences.forTable(this.table, ColumnReordering).delete('order');
    this.columnOrder = new ColumnOrder({
      columns: () => this.availableColumns,
      save: this.save,
    });
  }

  /**
   * @private
   */
  @action
  save(map: Map<string, number>) {
    const order: Record<string, number> = {};

    for (const [key, position] of map.entries()) {
      order[key] = position;
    }

    preferences.forTable(this.table, ColumnReordering).set('order', order);
  }

  /**
   * @private
   */
  @action
  private read() {
    const order = preferences
      .forTable(this.table, ColumnReordering)
      .get('order');

    if (!order) return;

    return new Map<string, number>(Object.entries(order));
  }

  get columns() {
    return this.columnOrder.orderedColumns;
  }

  /**
   * @private
   * This isn't our data to expose, but it is useful to alias
   */
  private get availableColumns() {
    return columns.for(this.table, ColumnReordering);
  }
}

/**
 * @private
 * Used for keeping track of and updating column order
 */
export class ColumnOrder {
  /**
   * This map will be empty until we re-order something.
   */
  map = new TrackedMap<string, number>();

  constructor(
    private args: {
      columns: () => Column[];
      save?: (order: Map<string, number>) => void;
      existingOrder?: Map<string, number>;
    },
  ) {
    if (args.existingOrder) {
      this.map = new TrackedMap(args.existingOrder);
    }
  }

  /**
   * To account for columnVisibilty, we need to:
   * - get the list of visible columns
   * - get the column order (which preserves the order of hidden columns)
   * - skip over non-visible columns when determining the previous "index"
   * - set the position to whatever that is.
   */
  @action
  moveLeft(key: string) {
    const orderedColumns = this.orderedColumns;

    let found = false;
    let nextColumn: { key: string } | undefined;

    for (const column of orderedColumns.reverse()) {
      if (found) {
        nextColumn = column;

        break;
      }

      if (column.key === key) {
        found = true;
      }
    }

    if (!nextColumn) return;

    const nextPosition = this.get(nextColumn.key);

    this.swapWith(key, nextPosition);
  }

  setAll = (map: Map<string, number>) => {
    this.map.clear();

    for (const [key, value] of map.entries()) {
      this.map.set(key, value);
    }

    this.args.save?.(map);
  };

  /**
   * To account for columnVisibilty, we need to:
   * - get the list of visible columns
   * - get the column order (which preserves the order of hidden columns)
   * - skip over non-visible columns when determining the next "index"
   * - set the position to whatever that is.
   */
  @action
  moveRight(key: string) {
    const orderedColumns = this.orderedColumns;

    let found = false;
    let nextColumn: { key: string } | undefined;

    for (const column of orderedColumns) {
      if (found) {
        nextColumn = column;

        break;
      }

      if (column.key === key) {
        found = true;
      }
    }

    if (!nextColumn) return;

    const nextPosition = this.get(nextColumn.key);

    this.swapWith(key, nextPosition);
  }

  /**
   * Performs a swap of the column's position with the column at position
   */
  @action
  swapWith(key: string, position: number) {
    const validPositions = [...this.orderedMap.values()];

    /**
     * Position to swap to must exist
     */
    if (!validPositions.includes(position)) {
      return;
    }

    /**
     * Where did this column `key` come from? we can find out
     * by reading orderedMap
     */
    const currentPosition = this.orderedMap.get(key);

    assert(
      `Pre-existing position for ${key} could not be found. Does the column exist? ` +
        `The current positions are: ` +
        [...this.orderedMap.entries()]
          .map((entry) => entry.join(' => '))
          .join(', ') +
        ` and the availableColumns are: ` +
        this.args
          .columns()
          .map((column) => column.key)
          .join(', ') +
        ` and current "map" (${this.map.size}) is: ` +
        [...this.map.entries()].map((entry) => entry.join(' => ')).join(', '),
      undefined !== currentPosition,
    );

    /**
     * No need to change anything if the position is the same
     * This helps reduce @tracked invalidations, which in turn reduces DOM thrashing.
     */
    if (currentPosition === position) {
      return false;
    }

    const keyByPosition = new Map<number, string>(
      [...this.orderedMap.entries()].map(
        (entry) => entry.reverse() as [number, string],
      ),
    );

    for (const [existingPosition, key] of keyByPosition.entries()) {
      if (existingPosition === position) {
        /**
         * We swap positions because the positions are not incremental
         * meaning we can have gaps, intentionally, due to hidden columns
         */
        this.map.set(key, currentPosition);

        break;
      }
    }

    /**
     * Finally, set the position for the requested column
     */
    this.map.set(key, position);

    /**
     * Now that we've set the value for one column,
     * we need to make sure that all columns have a recorded position.
     */
    for (const [key, position] of this.orderedMap.entries()) {
      if (this.map.has(key)) continue;

      this.map.set(key, position);
    }

    this.args.save?.(this.map);
  }

  @action
  get(key: string) {
    const result = this.orderedMap.get(key);

    assert(
      `No position found for ${key}. Is the column used within this table?`,
      /* 0 is falsey, but it's a valid value for position */
      undefined !== result,
    );

    return result;
  }

  /**
   * The same as this.map, but with all the columns' information
   */
  @cached
  get orderedMap(): ReadonlyMap<string, number> {
    return orderOf(this.args.columns(), this.map);
  }

  @cached
  get orderedColumns(): Column[] {
    const availableColumns = this.args.columns();
    const availableByKey = availableColumns.reduce(
      (keyMap, column) => {
        keyMap[column.key] = column;

        return keyMap;
      },
      {} as Record<string, Column>,
    );
    const mergedOrder = orderOf(availableColumns, this.map);

    const result: Column[] = Array.from({ length: availableColumns.length });

    for (const [key, position] of mergedOrder.entries()) {
      const column = availableByKey[key];

      assert(`Could not find column for pair: ${key} @ @{position}`, column);
      result[position] = column;
    }

    assert(
      `Generated orderedColumns' length (${result.filter(Boolean).length}) ` +
        `does not match the length of available columns (${availableColumns.length}). ` +
        `orderedColumns: ${result
          .filter(Boolean)
          .map((c) => c.key)
          .join(', ')} -- ` +
        `available columns: ${availableColumns.map((c) => c.key).join(', ')}`,
      result.filter(Boolean).length === availableColumns.length,
    );

    return result.filter(Boolean);
  }
}

/**
 * @private
 *
 * Utility for helping determine the percieved order of a set of columns
 * given the original (default) ordering, and then user-configurations
 */
export function orderOf(
  columns: { key: string }[],
  currentOrder: Map<string, number>,
): Map<string, number> {
  const result = new Map<string, number>();
  const availableColumns = columns.map((column) => column.key);
  const availableSet = new Set(availableColumns);
  const current = new Map<number, string>(
    [...currentOrder.entries()].map(([key, position]) => [position, key]),
  );

  /**
   * O(n * log(n)) ?
   */
  for (let i = 0; i < Math.max(columns.length, current.size); i++) {
    const orderedKey = current.get(i);

    if (orderedKey) {
      /**
       * If the currentOrder specifies columns not presently available,
       * ignore them
       */
      if (availableSet.has(orderedKey)) {
        result.set(orderedKey, i);
        continue;
      }
    }

    let availableKey: string | undefined;

    while ((availableKey = availableColumns.shift())) {
      if (result.has(availableKey) || currentOrder.has(availableKey)) {
        continue;
      }

      break;
    }

    if (!availableKey) {
      /**
       * The rest of our columns likely have their order set
       */
      continue;
    }

    result.set(availableKey, i);
  }

  return result;
}
