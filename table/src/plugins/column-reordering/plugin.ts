import { cached, tracked } from '@glimmer/tracking';
import { assert } from '@ember/debug';

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
  static features: string[] = ['columnOrder'];

  meta: {
    readonly column: typeof ColumnMeta;
    readonly table: typeof TableMeta;
  } = {
    column: ColumnMeta,
    table: TableMeta,
  } as const;

  reset(): void {
    const tableMeta = meta.forTable(this.table, ColumnReordering);

    tableMeta.reset();
  }

  get columns(): Column<unknown>[] {
    return meta.forTable(this.table, ColumnReordering).columns;
  }
}

export class ColumnMeta<DataType = unknown> {
  constructor(private column: Column<DataType>) {}

  get #tableMeta(): TableMeta<DataType> {
    return meta.forTable(
      this.column.table,
      ColumnReordering,
    ) as TableMeta<DataType>;
  }

  get position() {
    return this.#tableMeta.getPosition(this.column);
  }

  // Swaps this column with the column in the new position
  set position(value: number) {
    this.#tableMeta.setPosition(this.column, value);
  }

  get canMoveLeft(): boolean {
    return this.#tableMeta.getPosition(this.column) !== 0;
  }

  get canMoveRight(): boolean {
    return (
      this.#tableMeta.getPosition(this.column) !==
      this.#tableMeta.columns.length - 1
    );
  }

  get cannotMoveLeft(): boolean {
    return !this.canMoveLeft;
  }

  get cannotMoveRight(): boolean {
    return !this.canMoveRight;
  }

  /**
   * Move the column one spot to the left
   */
  moveLeft = (): void => {
    this.#tableMeta.columnOrder.moveLeft(this.column.key);
  };

  /**
   * Move the column one spot to the right
   */
  moveRight = (): void => {
    this.#tableMeta.columnOrder.moveRight(this.column.key);
  };
}

export class TableMeta<DataType = unknown> {
  constructor(private table: Table<DataType>) {}

  /**
   * @private
   *
   * We want to maintain the instance of this ColumnOrder class because
   * we allow the consumer of the table to swap out columns at any time.
   * When they do this, we want to maintain the order of the table, best we can.
   * This is also why the order of the columns is maintained via column key
   */
  @tracked
  columnOrder: ColumnOrder<DataType> = new ColumnOrder<DataType>({
    columns: () => this.allColumns,
    visibleColumns: () => this.visibleColumns,
    save: (map) => this.save(map),
    read: () => this.read(),
  });

  /**
   * Get the curret order/position of a column
   */
  getPosition = (column: Column<DataType>): number => {
    return this.columnOrder.get(column.key);
  };

  /**
   * Swap the column with the column at `newPosition`
   */
  setPosition = (
    column: Column<DataType>,
    newPosition: number,
  ): false | undefined => {
    return this.columnOrder.swapWith(column.key, newPosition);
  };

  /**
   * Using a `ColumnOrder` instance, set the order of all columns
   */
  setOrder = (order: ColumnOrder<DataType>): void => {
    this.columnOrder.setAll(order.map);
  };

  /**
   * Revert to default config, delete preferences,
   * and clear the columnOrder
   */
  reset = (): void => {
    preferences.forTable(this.table, ColumnReordering).delete('order');
    this.columnOrder = new ColumnOrder<DataType>({
      columns: () => this.allColumns,
      visibleColumns: () => this.visibleColumns,
      save: this.save,
    });
  };

  /**
   * @private
   */
  save = (map: Map<string, number>): void => {
    const order: Record<string, number> = {};

    for (const [key, position] of map.entries()) {
      order[key] = position;
    }

    preferences.forTable(this.table, ColumnReordering).set('order', order);
  };

  /**
   * @private
   */
  private read = () => {
    const order = preferences
      .forTable(this.table, ColumnReordering)
      .get('order');

    if (!order) return;

    return new Map<string, number>(Object.entries(order));
  };

  get columns(): Column<DataType>[] {
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
export class ColumnOrder<DataType = unknown> {
  /**
   * This map will be empty until we re-order something.
   */
  map: TrackedMap<string, number> = new TrackedMap<string, number>();

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
      columns: () => Column<DataType>[];
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
       * Optional: Callback to read the current saved order from preferences.
       * Called reactively - when preferences change, order updates automatically.
       */
      read?: () => Map<string, number> | undefined;
      /**
       * @deprecated Use `read` instead for reactive preferences support.
       * Optional: Previously saved column order to restore.
       */
      existingOrder?: Map<string, number>;
    },
  ) {
    // Initialize map from existingOrder for backwards compatibility
    // The reactive `read` callback will override this in orderedMap
    let allColumns = this.args.columns();
    const initialOrder = args.existingOrder ?? args.read?.();

    if (initialOrder) {
      let newOrder = new Map(initialOrder.entries());

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
  moveLeft = (key: string): void => {
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
  };

  setAll = (map: Map<string, number>): void => {
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
  moveRight = (key: string): void => {
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
  };

  /**
   * Performs a swap of the column's position with the column at position
   */
  swapWith = (key: string, position: number): false | undefined => {
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
  };

  get = (key: string): number => {
    const result = this.orderedMap.get(key);

    assert(
      `No position found for ${key}. Is the column used within this table?`,
      /* 0 is falsey, but it's a valid value for position */
      undefined !== result,
    );

    return result;
  };

  /**
   * The same as this.map, but with all the columns' information.
   * Prefers preferences (via read callback) when available for reactivity.
   */
  @cached
  get orderedMap(): ReadonlyMap<string, number> {
    // Prefer preferences for reactivity, fall back to local map
    const savedOrder = this.args.read?.();
    const baseMap = savedOrder ?? this.map;
    return orderOf(this.args.columns(), baseMap);
  }

  @cached
  get orderedColumns(): Column<DataType>[] {
    const allColumns = this.args.columns();
    const columnsByKey = allColumns.reduce(
      (keyMap, column) => {
        keyMap[column.key] = column;
        return keyMap;
      },
      {} as Record<string, Column<DataType>>,
    );
    // Use orderedMap which is reactive to preferences
    const mergedOrder = this.orderedMap;

    const result: Column<DataType>[] = Array.from({
      length: allColumns.length,
    });

    for (const [key, position] of mergedOrder.entries()) {
      const column = columnsByKey[key];

      // Skip columns that no longer exist (they've been removed from the columns array)
      if (!column) {
        continue;
      }

      result[position] = column;
    }

    // Filter out undefined entries (from removed columns or gaps in positions)
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
  let maxAssignedColumn = Math.max(...map.values());

  for (let column of columns) {
    if (map.get(column.key) === undefined) {
      map.set(column.key, ++maxAssignedColumn);
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
