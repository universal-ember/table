import { options } from '../-private/base.ts';
import { Metadata } from './plugin.ts';

import type { Column, Table } from '[public-types]';

export const forColumn = (column: Column<any>, key: string) => {
  return options.forColumn(column, Metadata)[key];
};

export const forTable = (table: Table<any>, key: string) => {
  return options.forTable(table, Metadata)[key];
};
