import { meta } from '../-private/base.ts';
import { ColumnVisibility } from './plugin.ts';

import type { Column } from '../../index.ts';

/**
 * Hide a column
 */
export const hide = <DataType = unknown>(column: Column<DataType>) =>
  meta.forColumn(column, ColumnVisibility).hide();

/**
 * Show a column
 */
export const show = <DataType = unknown>(column: Column<DataType>) =>
  meta.forColumn(column, ColumnVisibility).show();

/**
 * Ask if a column is presently supposed to be visible
 */
export const isVisible = <DataType = unknown>(column: Column<DataType>) =>
  meta.forColumn(column, ColumnVisibility).isVisible;

/**
 * Ask if a column is presently supposed to be hidden
 */
export const isHidden = <DataType = unknown>(column: Column<DataType>) =>
  meta.forColumn(column, ColumnVisibility).isHidden;
