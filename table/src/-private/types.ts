import type { ColumnMeta } from './interfaces/column.ts';
import type { TableMeta } from './interfaces/table.ts';

/**
 * The types a table declares for itself.
 *
 * ```ts
 * interface ReportTypes {
 *   columnMeta: ReportColumnMeta;
 *   tableMeta: ReportTableMeta;
 * }
 *
 * headlessTable(this, { types: tableTypes<ReportTypes>(), columns, data });
 *
 * const columns: ColumnConfig<Person, ReportTypes>[] = [];
 * ```
 *
 * Only tables created with these types get them, so two tables in one app
 * can declare different shapes. The slot names are those of TanStack Table.
 */
export interface TableTypes {
  columnMeta?: object;
  tableMeta?: object;
}

/**
 * Carries a table's types into its config. Only the type is used.
 *
 * It is a call because TypeScript infers a type argument from a value:
 * writing `headlessTable<Person, ReportTypes>(...)` would stop `Person` being inferred.
 */
export function tableTypes<Types extends TableTypes>(): Types {
  return {} as Types;
}

declare const undeclared: unique symbol;

/**
 * The column meta of a table that declares none.
 * It has one key nobody can write, so that writing or reading any other key is an error.
 * An empty interface would accept every key.
 */
export interface NoColumnMeta {
  readonly [undeclared]?: never;
}

/**
 * The type of `column.meta`: the table's `columnMeta` when it declares one,
 * else the app-wide `ColumnMeta` interface, else `NoColumnMeta`.
 */
export type ExtractColumnMeta<Types, T = unknown> = Types extends {
  columnMeta: object;
}
  ? Types['columnMeta']
  : keyof ColumnMeta<T> extends never
    ? NoColumnMeta
    : ColumnMeta<T>;

/**
 * The type of `table.config.meta`: the table's `tableMeta` slot when it declares one,
 * together with the keys this library defines itself.
 */
export type ExtractTableMeta<Types> = Types extends { tableMeta: object }
  ? TableMeta & Types['tableMeta']
  : TableMeta;
