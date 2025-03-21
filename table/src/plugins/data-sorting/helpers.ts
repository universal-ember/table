import { meta } from '../-private/base.ts';
import { Sorting } from './plugin.ts';

import type { Column } from '../../index.ts';

/**
 * Query a specific column's current sort direction
 */
export const sortDirection = (column: Column) =>
  meta.forColumn(column, Sorting).sortDirection;

/**
 * Ask if a column is sortable
 */
export const isSortable = (column: Column) =>
  meta.forColumn(column, Sorting).isSortable;

/**
 * Ask if a column is ascending
 */
export const isAscending = (column: Column) =>
  meta.forColumn(column, Sorting).isAscending;

/**
 * Ask if a column is sorted descending
 */
export const isDescending = (column: Column) =>
  meta.forColumn(column, Sorting).isDescending;

/**
 * Ask if a column is not sorted
 */
export const isUnsorted = (column: Column) =>
  meta.forColumn(column, Sorting).isUnsorted;

/**
 * Sort the specified column's data using a tri-toggle.
 *
 * States go in this order:
 *   Ascending => None => Descending
 *    ⬑ ---------- <= ---------- ↲
 */
export const sort = (column: Column) =>
  meta.forTable(column.table, Sorting).handleSort(column);

/**
 * Toggle a column between descending and not unsorted states
 */
export const sortDescending = (column: Column) =>
  meta.forTable(column.table, Sorting).toggleDescending(column);

/**
 * Toggle a column between ascending and not unsorted states
 */
export const sortAscending = (column: Column) =>
  meta.forTable(column.table, Sorting).toggleAscending(column);
