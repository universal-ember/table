import { meta } from '../-private/base.ts';
import { ColumnReordering } from './plugin.ts';

import type { ColumnOrder, TableMeta } from './plugin.ts';
import type { Column, Table } from '../../index.ts';

/**
 * Move the column one position to the left.
 * If the column is first, nothing will happen.
 */
export const moveLeft = <DataType = unknown>(column: Column<DataType>) =>
  meta.forColumn(column, ColumnReordering).moveLeft();

/**
 * Move the column one position to the right.
 * If the column is last, nothing will happen.
 */
export const moveRight = <DataType = unknown>(column: Column<DataType>) =>
  meta.forColumn(column, ColumnReordering).moveRight();

/**
 * Override all column positions at once.
 */
export const setColumnOrder = <DataType = unknown>(
  table: Table<DataType>,
  order: ColumnOrder<DataType>,
) => {
  // Note: The meta.forTable API doesn't preserve the DataType generic from the table parameter.
  // We use a type assertion here to match the expected types.
  const tableMeta = meta.forTable(
    table,
    ColumnReordering,
  ) as TableMeta<DataType>;
  return tableMeta.setOrder(order);
};

/**
 * Ask if the column cannot move to the left
 */
export const cannotMoveLeft = <DataType = unknown>(column: Column<DataType>) =>
  meta.forColumn(column, ColumnReordering).cannotMoveLeft;

/**
 * Ask if the column cannot move to the right
 */
export const cannotMoveRight = <DataType = unknown>(column: Column<DataType>) =>
  meta.forColumn(column, ColumnReordering).cannotMoveRight;

/**
 * Ask if the column can move to the left
 * (If your plugin doesn't expose `canMoveLeft`, use `!cannotMoveLeft`.)
 */
export const canMoveLeft = <DataType = unknown>(column: Column<DataType>) =>
  // Prefer this if available:
  // meta.forColumn(column, ColumnReordering).canMoveLeft
  !meta.forColumn(column, ColumnReordering).cannotMoveLeft;

/**
 * Ask if the column can move to the right
 * (If your plugin doesn't expose `canMoveRight`, use `!cannotMoveRight`.)
 */
export const canMoveRight = <DataType = unknown>(column: Column<DataType>) =>
  // Prefer this if available:
  // meta.forColumn(column, ColumnReordering).canMoveRight
  !meta.forColumn(column, ColumnReordering).cannotMoveRight;

/**
 * Get the columns in their current display order.
 *
 * This returns an array of columns sorted according to any reordering
 * that has been applied via the ColumnReordering plugin. If no reordering
 * has been applied, columns are returned in their original order.
 *
 * @param table - The table instance to get ordered columns from
 * @returns Array of columns in their current display order
 *
 * @example
 * ```ts
 * import { orderedColumnsFor } from '@universal-ember/table/plugins/column-reordering';
 *
 * const columns = orderedColumnsFor(table);
 * // Use the ordered columns for rendering or other operations
 * ```
 */
export const orderedColumnsFor = <DataType = unknown>(
  table: Table<DataType>,
): Column<DataType>[] => {
  // Note: The meta.forTable API doesn't preserve the DataType generic from the table parameter.
  // This is a limitation of the current plugin meta system architecture.
  // We use a type assertion here because we know the columns come from the same table.
  const tableMeta = meta.forTable(
    table,
    ColumnReordering,
  ) as TableMeta<DataType>;
  return tableMeta.columnOrder.orderedColumns;
};
