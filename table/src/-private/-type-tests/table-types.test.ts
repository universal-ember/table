import { expectTypeOf } from 'expect-type';

import { headlessTable, tableTypes } from '../../index.ts';
import {
  ColumnVisibility,
  isVisible,
} from '../../plugins/column-visibility/index.ts';
import { DataSorting, sort } from '../../plugins/data-sorting/index.ts';
import { columns, meta } from '../../plugins/index.ts';

import type { CellContext, Column, ColumnConfig, Table } from '../../index.ts';
import type { ComponentLike } from '@glint/template';

interface Person {
  name: string;
  age: number;
}
declare const people: Person[];

/////////////////////////////////////////////
// A table declares its own column meta and table meta
interface ReportColumnMeta {
  align?: 'left' | 'right';
  exportWidth?: number;
}
interface ReportTableMeta {
  updateCell: (data: Person, key: string, value: unknown) => void;
}

interface ReportTypes {
  columnMeta: ReportColumnMeta;
  tableMeta: ReportTableMeta;
}
const types = tableTypes<ReportTypes>();

const report = headlessTable(
  {},
  {
    types,
    columns: () => [
      { key: 'name', meta: { align: 'left' } },
      { key: 'age', meta: { align: 'right', exportWidth: 12 } },
    ],
    data: () => people,
    meta: { updateCell: () => {} },
    plugins: [ColumnVisibility, DataSorting],
  },
);

// the row type is still inferred
expectTypeOf(report.rows[0]!.data).toEqualTypeOf<Person>();

// meta is typed where a column is read, with no declaration merging
expectTypeOf(report.columns[0]!.meta).toEqualTypeOf<
  ReportColumnMeta | undefined
>();
expectTypeOf(report.columns[0]!.table.config.meta!.updateCell).toBeFunction();

// helpers that return columns keep the type
expectTypeOf(columns.for(report)[0]!.meta).toEqualTypeOf<
  ReportColumnMeta | undefined
>();
expectTypeOf(columns.next(report.columns[0]!)!.meta).toEqualTypeOf<
  ReportColumnMeta | undefined
>();

// plugin helpers take the typed table and column
expectTypeOf(isVisible(report.columns[0]!)).toEqualTypeOf<boolean>();
sort(report.columns[0]!);
meta.forColumn(report.columns[0]!, ColumnVisibility);

// code that knows nothing about these types accepts the table and its columns
function takesAnyColumn(column: Column<Person>) {
  return column.key;
}
function takesAnyTable(table: Table<Person>) {
  return table.columns.length;
}
takesAnyColumn(report.columns[0]!);
takesAnyTable(report);

// shared code can ask for the meta it needs, and still use the whole table
function exportWidths<
  T,
  TableTypes extends { columnMeta: { exportWidth?: number } },
>(table: Table<T, TableTypes>) {
  return columns.for(table).map((column) => column.meta?.exportWidth);
}
expectTypeOf(exportWidths(report)).toEqualTypeOf<(number | undefined)[]>();

// shared code declares the meta it reads; it fits every table that has it
function exportWidthOf(column: { meta?: { exportWidth?: number } }) {
  return column.meta?.exportWidth;
}
expectTypeOf(exportWidthOf(report.columns[0]!)).toEqualTypeOf<
  number | undefined
>();

headlessTable(
  {},
  {
    types,
    // @ts-expect-error not a key of this table's column meta
    columns: () => [{ key: 'name', meta: { colour: 'red' } }],
    data: () => people,
    meta: { updateCell: () => {} },
  },
);

headlessTable(
  {},
  {
    types,
    columns: () => [{ key: 'name' }],
    data: () => people,
    // @ts-expect-error this table's meta must have `updateCell`
    meta: {},
  },
);

/////////////////////////////////////////////
// Another table in the same program has another shape
const other = headlessTable(
  {},
  {
    types: tableTypes<{ columnMeta: { sticky?: boolean } }>(),
    columns: () => [{ key: 'name', meta: { sticky: true } }],
    data: () => people,
  },
);

expectTypeOf(other.columns[0]!.meta).toEqualTypeOf<
  { sticky?: boolean } | undefined
>();

// @ts-expect-error `exportWidth` is not in this table's column meta
exportWidthOf(other.columns[0]!);
// @ts-expect-error `exportWidth` is not in this table's column meta
exportWidths(other);

/////////////////////////////////////////////
// Inside `value`, `options` and a `Cell`, the column has this table's meta
declare const AlignedCell: ComponentLike<CellContext<Person, ReportTypes>>;

headlessTable(
  {},
  {
    types,
    columns: () => [
      {
        key: 'age',
        Cell: AlignedCell,
        value: ({ column }) => {
          expectTypeOf(column.meta?.align).toEqualTypeOf<
            'left' | 'right' | undefined
          >();

          return column.meta?.exportWidth ?? 0;
        },
        options: ({ column }) => ({
          wide: (column.meta?.exportWidth ?? 0) > 10,
        }),
      },
    ],
    data: () => people,
    meta: { updateCell: () => {} },
  },
);

type AlignedCellArgs =
  typeof AlignedCell extends ComponentLike<infer Args> ? Args : never;

expectTypeOf<AlignedCellArgs['column']['meta']>().toEqualTypeOf<
  ReportColumnMeta | undefined
>();

/////////////////////////////////////////////
// A column list written elsewhere names the types it was written for.
// `types` alone decides the table's types: an untyped list cannot widen them.
const typedList: ColumnConfig<Person, ReportTypes>[] = [
  { key: 'name', meta: { align: 'left' } },
];
const fromList = headlessTable(
  {},
  {
    types,
    columns: () => typedList,
    data: () => people,
    meta: { updateCell: () => {} },
  },
);

expectTypeOf(fromList.columns[0]!.meta).toEqualTypeOf<
  ReportColumnMeta | undefined
>();

const untypedList: ColumnConfig<Person>[] = [{ key: 'name' }];
const stillTyped = headlessTable(
  {},
  {
    types,
    columns: () => untypedList,
    data: () => people,
    meta: { updateCell: () => {} },
  },
);

expectTypeOf(stillTyped.columns[0]!.meta).toEqualTypeOf<
  ReportColumnMeta | undefined
>();

/////////////////////////////////////////////
// Meta that nothing declares is an error, with and without `types`
headlessTable(
  {},
  {
    types: tableTypes<{ tableMeta: ReportTableMeta }>(),
    // @ts-expect-error these types declare no column meta
    columns: () => [{ key: 'name', meta: { undeclared: 1 } }],
    data: () => people,
    meta: { updateCell: () => {} },
  },
);

/////////////////////////////////////////////
// Code written before `types` existed keeps working: bare annotations accept
// columns, configs and tables, from tables with and without `types`
const plain = headlessTable(
  {},
  {
    columns: () => [{ key: 'name' }],
    data: () => people,
  },
);

export const bareRowColumns: Column<Person>[] = [
  ...plain.columns,
  ...report.columns,
];
export const bareConfigs: ColumnConfig<Person>[] = [{ key: 'name' }];
export const bareTables: Table<Person>[] = [plain, report];

function legacyHelper(columns: Column<Person>[]) {
  return columns.map((column) => column.key);
}
legacyHelper([...plain.columns]);
legacyHelper([...report.columns]);

/////////////////////////////////////////////
// A table can give its cells args of its own, passed where the cell is rendered:
// <column.Cell @row={{row}} @column={{column}} @dateRange={{@dateRange}} />
interface ListTypes {
  cellArgs: { dateRange: [Date, Date]; onUpdate: (person: Person) => void };
}

declare const DateCell: ComponentLike<
  CellContext<Person, ListTypes> & ListTypes['cellArgs']
>;
declare const UntypedCell: ComponentLike<CellContext<Person>>;

const list = headlessTable(
  {},
  {
    types: tableTypes<ListTypes>(),
    columns: () => [
      { key: 'name', Cell: DateCell },
      { key: 'plain', Cell: UntypedCell },
    ],
    data: () => people,
    plugins: [ColumnVisibility],
  },
);

type Args =
  NonNullable<(typeof list.columns)[0]['Cell']> extends ComponentLike<infer A>
    ? A
    : never;
expectTypeOf<Args['dateRange']>().toEqualTypeOf<[Date, Date]>();

// typed columns and tables still fit code that knows nothing about these types
expectTypeOf(isVisible(list.columns[0]!)).toEqualTypeOf<boolean>();
expectTypeOf(columns.for(list)).toBeArray();
function anyColumn(column: Column<Person>) {
  return column.key;
}
function anyTable(table: Table<Person>) {
  return table.columns.length;
}
anyColumn(list.columns[0]!);
anyTable(list);
