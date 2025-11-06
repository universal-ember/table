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

  // Swaps this column with the column in the new position
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
    columns: () => this.allColumns,
    visibleColumns: () => this.visibleColumns,
    save: this.save,
    existingOrder: this.read(),
  });

  /**
   * Get the curret order/position of a column
   */
  @action
  getPosition<DataType = unknown>(column: Column) {
    return this.columnOrder.get(column.key);
  }

  /**
   * Swap the column with the column at `newPosition`
   */
  @action
  setPosition<DataType = unknown>(column: Column, newPosition: number) {
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
      columns: () => this.allColumns,
      visibleColumns: () => this.visibleColumns,
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
    return this.columnOrder.orderedColumns.filter(
      (column) => this.visibleColumns[column.key],
    );
  }

  /**
   * @private
   * This isn't our data to expose, but it is useful to alias
   */
  private get visibleColumns() {
    return columns
      .for(this.table, ColumnReordering)
      .reduce<Record<string, boolean>>((acc, column) => {
        acc[column.key] = true;

        return acc;
      }, {});
  }

  private get allColumns() {
    return this.table.columns.values();
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
      /**
       * All columns to track in the ordering.
       *
       * Backwards compatible usage (without ColumnVisibility):
       * - Pass only the columns you want to display
       * - All columns are treated as visible
       *
       * New usage (with ColumnVisibility):
       * - Pass ALL columns (including hidden ones)
       * - Provide `visibleColumns` to indicate which are visible
       * - Hidden columns maintain their position when toggled
       */
      columns: () => Column[];
      /**
       * Optional: Record of which columns are currently visible.
       * When provided, moveLeft/moveRight will skip over hidden columns.
       * When omitted, all columns from `columns` are treated as visible (backwards compatible).
       *
       * Example when using ColumnVisibility:
       * ```ts
       * visibleColumns: () => columns.reduce((acc, col) => {
       *   acc[col.key] = meta(col).ColumnVisibility?.isVisible !== false;
       *   return acc;
       * }, {})
       * ```
       */
      visibleColumns?: () => Record<string, boolean>;
      /**
       * Optional: Callback to persist the column order (e.g., to localStorage).
       */
      save?: (order: Map<string, number>) => void;
      /**
       * Optional: Previously saved column order to restore.
       */
      existingOrder?: Map<string, number>;
    },
  ) {
    let allColumns = this.args.columns();

    if (args.existingOrder) {
      let newOrder = new Map(args.existingOrder.entries());

      addMissingColumnsToMap(allColumns, newOrder);
      removeExtraColumnsFromMap(allColumns, newOrder);
      this.map = new TrackedMap(newOrder);
    } else {
      this.map = new TrackedMap(allColumns.map((column, i) => [column.key, i]));
    }
  }

  /**
   * @private
   * Helper to get visible columns, defaulting to all columns if not specified
   */
  private getVisibleColumns(): Record<string, boolean> {
    if (this.args.visibleColumns) {
      return this.args.visibleColumns();
    }

    // Default: all columns are visible
    return this.args.columns().reduce(
      (acc, col) => {
        acc[col.key] = true;
        return acc;
      },
      {} as Record<string, boolean>,
    );
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
    if (this.map.get(key) === 0) {
      return;
    }

    let found = false;

    for (const column of orderedColumns.reverse()) {
      if (found) {
        // Shift moved column left
        let currentPosition = this.map.get(key);

        assert('current key must exist in map', currentPosition !== undefined);
        this.map.set(key, currentPosition - 1);

        // Shift displayed column right
        let displayedColumnPosition = this.map.get(column.key);

        assert(
          'displaced key must exist in map',
          displayedColumnPosition !== undefined,
        );
        this.map.set(column.key, displayedColumnPosition + 1);

        if (this.getVisibleColumns()[column.key]) {
          break;
        }
      }

      if (column.key === key) {
        found = true;
      }
    }

    this.args.save?.(this.map);
  }

  setAll = (map: Map<string, number>) => {
    let allColumns = this.args.columns();

    addMissingColumnsToMap(allColumns, map);
    removeExtraColumnsFromMap(allColumns, map);

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

    for (const column of orderedColumns) {
      if (found) {
        // Shift moved column right
        let currentPosition = this.map.get(key);

        assert('current key must exist in map', currentPosition !== undefined);
        this.map.set(key, currentPosition + 1);

        // Shift displaced column left
        let displayedColumnPosition = this.map.get(column.key);

        assert(
          'displaced key must exist in map',
          displayedColumnPosition !== undefined,
        );
        this.map.set(column.key, displayedColumnPosition - 1);

        if (this.getVisibleColumns()[column.key]) {
          break;
        }
      }

      if (column.key === key) {
        found = true;
      }
    }

    this.args.save?.(this.map);
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
        ` and the visibleColumns are: ` +
        Object.keys(this.getVisibleColumns()).join(', ') +
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
    const allColumns = this.args.columns();
    const columnsByKey = allColumns.reduce(
      (keyMap, column) => {
        keyMap[column.key] = column;
        return keyMap;
      },
      {} as Record<string, Column>,
    );
    const mergedOrder = orderOf(allColumns, this.map);

    const result: Column[] = Array.from({
      length: allColumns.length,
    });

    for (const [key, position] of mergedOrder.entries()) {
      const column = columnsByKey[key];

      assert(`Could not find column for pair: ${key} @ @{position}`, column);
      result[position] = column;
    }

    assert(
      `Generated orderedColumns' length (${result.filter(Boolean).length}) ` +
        `does not match the length of all columns (${allColumns.length}). ` +
        `orderedColumns: ${result
          .filter(Boolean)
          .map((c) => c.key)
          .join(', ')} -- ` +
        `all columns: ${allColumns.map((c) => c.key).join(', ')}`,
      result.filter(Boolean).length === allColumns.length,
    );

    return result.filter(Boolean);
  }
}

/**
 * @private
 *
 * Utility for helping determine the percieved order of a set of columns
 * given the original (default) ordering, and then user-configurations.
 *
 * This function adds missing columns but preserves extra columns in the map
 * (they might be hidden, not deleted).
 */
export function orderOf(
  columns: { key: string }[],
  currentOrder: Map<string, number>,
): Map<string, number> {
  // Create a copy to avoid mutating the input
  let workingOrder = new Map(currentOrder);

  // Add any missing columns to the end
  addMissingColumnsToMap(columns, workingOrder);

  // DON'T remove extra columns - they might be hidden columns, not deleted ones
  // The ColumnOrder constructor handles removal of truly deleted columns

  // Ensure positions are consecutive and zero based
  let inOrder = Array.from(workingOrder.entries()).sort(
    ([_keyA, positionA], [_keyB, positionB]) => positionA - positionB,
  );

  let orderedColumns = new Map<string, number>();

  let position = 0;

  for (let [key] of inOrder) {
    orderedColumns.set(key, position++);
  }

  return orderedColumns;
}

/**
 * @private
 *
 * Utility to add any missing columns to the position map. By calling this whenever
 * data is passed in to the system we can simplify the code within the system because
 * we know we are dealing with a full set of positions.
 *
 * @param columns - A list of all columns available to the table
 * @param map - A Map of `key` to position (as a zero based integer)
 */
function addMissingColumnsToMap(
  columns: { key: string }[],
  map: Map<string, number>,
): void {
  if (map.size < columns.length) {
    let maxAssignedColumn = Math.max(...map.values());

    for (let column of columns) {
      if (map.get(column.key) === undefined) {
        map.set(column.key, ++maxAssignedColumn);
      }
    }
  }
}

/**
 * @private
 *
 * Utility to remove any extra columns from the position map. By calling this whenever
 * data is passed in to the system we can simplify the code within the system because
 * we know we are dealing with a full set of positions.
 *
 * @param columns - A list of all columns available to the table
 * @param map - A Map of `key` to position (as a zero based integer)
 */
function removeExtraColumnsFromMap(
  columns: { key: string }[],
  map: Map<string, number>,
): void {
  let columnsLookup = columns.reduce(
    function (acc, { key }) {
      acc[key] = true;

      return acc;
    },
    {} as Record<string, boolean>,
  );

  for (let key of map.keys()) {
    if (!columnsLookup[key]) {
      map.delete(key);
    }
  }
}
