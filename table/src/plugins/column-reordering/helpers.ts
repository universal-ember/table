import { meta } from '../-private/base.ts';
import { ColumnReordering } from './plugin.ts';

import type { ColumnOrder } from './plugin.ts';
import type { Column, Table } from '../../index.ts';

/**
 * Move the column one position to the left.
 * If the column is first, nothing will happen.
 */
export const moveLeft = (column: Column) =>
  meta.forColumn(column, ColumnReordering).moveLeft();

/**
 * Move the column one position to the right.
 * If the column is last, nothing will happen.
 */
export const moveRight = (column: Column) =>
  meta.forColumn(column, ColumnReordering).moveRight();

/**
 * Override all column positions at once.
 */
export const setColumnOrder = (table: Table, order: ColumnOrder) => {
  return meta.forTable(table, ColumnReordering).setOrder(order);
};

/**
 * Ask if the column cannot move to the left
 */
export const cannotMoveLeft = (column: Column) =>
  meta.forColumn(column, ColumnReordering).cannotMoveLeft;

/**
 * Ask if the column cannot move to the right
 */
export const cannotMoveRight = (column: Column) =>
  meta.forColumn(column, ColumnReordering).cannotMoveRight;

/**
 * Ask if the column can move to the left
 */
export const canMoveLeft = (column: Column) =>
  meta.forColumn(column, ColumnReordering).cannotMoveLeft;

/**
 * Ask if the column can move to the right
 */
export const canMoveRight = (column: Column) =>
  meta.forColumn(column, ColumnReordering).cannotMoveRight;
