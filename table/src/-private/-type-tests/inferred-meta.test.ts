import { expectTypeOf } from 'expect-type';

import { headlessTable } from '../../index.ts';
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
// Column meta and table meta are inferred from the config
const report = headlessTable(
  {},
  {
    columns: () => [
      { key: 'name', meta: { align: 'left' } },
      { key: 'age', meta: { align: 'right', exportWidth: 12 } },
      { key: 'plain' },
    ],
    data: () => people,
    meta: {
      updateCell: (data: Person, key: string, value: unknown) => {
        data[key as keyof Person] = value as never;
      },
    },
    plugins: [ColumnVisibility, DataSorting],
  },
);

// the row type is still inferred
expectTypeOf(report.rows[0]!.data).toEqualTypeOf<Person>();

// each column's meta merges into one type
expectTypeOf(report.columns[0]!.meta).toEqualTypeOf<
  { align?: 'left' | 'right'; exportWidth?: 12 } | undefined
>();

// the table meta keeps the keys of TableMeta
expectTypeOf(report.config.meta!.updateCell)
  .parameter(0)
  .toEqualTypeOf<Person>();
expectTypeOf(report.config.meta!.totalRowCount).toEqualTypeOf<
  number | undefined
>();
expectTypeOf(report.columns[0]!.table.config.meta!.updateCell).toBeFunction();

// helpers that return columns keep the type
expectTypeOf(columns.for(report)[0]!.meta?.align).toEqualTypeOf<
  'left' | 'right' | undefined
>();
expectTypeOf(columns.next(report.columns[0]!)!.meta?.align).toEqualTypeOf<
  'left' | 'right' | undefined
>();

// plugin helpers take the typed table and column
expectTypeOf(isVisible(report.columns[0]!)).toEqualTypeOf<boolean>();
sort(report.columns[0]!);
meta.forColumn(report.columns[0]!, ColumnVisibility);

// code that knows nothing about meta accepts the table and its columns
function takesAnyColumn(column: Column<Person>) {
  return column.key;
}
function takesAnyTable(table: Table<Person>) {
  return table.columns.length;
}
takesAnyColumn(report.columns[0]!);
takesAnyTable(report);

// shared code can ask for the meta it needs
function exportWidthOf(column: Column<Person, { exportWidth?: number }>) {
  return column.meta?.exportWidth;
}
exportWidthOf(report.columns[0]!);

/////////////////////////////////////////////
// Without meta, reading meta is an error
const plain = headlessTable(
  {},
  {
    columns: () => [{ key: 'name' }],
    data: () => people,
  },
);

expectTypeOf(plain.columns[0]!.meta).toEqualTypeOf<unknown>();
// @ts-expect-error nothing sets a column meta
expectTypeOf(plain.columns[0]!.meta?.align);

/////////////////////////////////////////////
// Callbacks do not stop the inference, and see the row and the table meta
const withCallbacks = headlessTable(
  {},
  {
    columns: () => [
      {
        key: 'age',
        meta: { align: 'right' },
        value: ({ column, row }) => {
          expectTypeOf(row.data).toEqualTypeOf<Person>();
          expectTypeOf(column.table.config.meta!.unit).toEqualTypeOf<string>();

          return row.data.age;
        },
        options: ({ column }) => ({
          unit: column.table.config.meta!.unit,
        }),
      },
    ],
    data: () => people,
    meta: { unit: 'years' },
  },
);

expectTypeOf(withCallbacks.columns[0]!.meta?.align).toEqualTypeOf<
  'right' | undefined
>();

/////////////////////////////////////////////
// A declared meta type checks every column, and is kept as it is
interface ReportColumnMeta {
  align?: 'left' | 'right';
  exportWidth?: number;
}

const typedList: ColumnConfig<Person, ReportColumnMeta>[] = [
  { key: 'name', meta: { align: 'left' } },
];
const fromList = headlessTable(
  {},
  {
    columns: () => typedList,
    data: () => people,
  },
);

expectTypeOf(fromList.columns[0]!.meta).toEqualTypeOf<
  ReportColumnMeta | undefined
>();

const badList: ColumnConfig<Person, ReportColumnMeta>[] = [
  // @ts-expect-error not one of the declared alignments
  { key: 'name', meta: { align: 'middle' } },
];

// `satisfies` checks a column in place, and the literal type is still inferred
const checked = headlessTable(
  {},
  {
    columns: () => [
      { key: 'name', meta: { align: 'left' } satisfies ReportColumnMeta },
    ],
    data: () => people,
  },
);
expectTypeOf(checked.columns[0]!.meta?.align).toEqualTypeOf<
  'left' | undefined
>();

/////////////////////////////////////////////
// Extra args for cells come through the table meta
interface DateRangeMeta {
  dateRange: [Date, Date];
}

declare const DateCell: ComponentLike<
  CellContext<Person, unknown, DateRangeMeta>
>;

const ranged = headlessTable(
  {},
  {
    columns: () => [{ key: 'name', Cell: DateCell }],
    data: () => people,
    meta: { dateRange: [new Date(), new Date()] as [Date, Date] },
  },
);

expectTypeOf(ranged.columns[0]!.table.config.meta!.dateRange).toEqualTypeOf<
  [Date, Date]
>();

// A Cell that reads column meta fits columns whose meta matches
declare const AlignedCell: ComponentLike<
  CellContext<Person, { align?: 'left' | 'right' }>
>;

headlessTable(
  {},
  {
    columns: () => [
      { key: 'name', meta: { align: 'left' }, Cell: AlignedCell },
      { key: 'age', Cell: AlignedCell, meta: { align: 'right' } },
    ],
    data: () => people,
  },
);

headlessTable(
  {},
  {
    columns: () => [
      {
        key: 'name',
        meta: { align: 'middle' },
        // @ts-expect-error not one of the alignments the Cell handles
        Cell: AlignedCell,
      },
    ],
    data: () => people,
  },
);

headlessTable(
  {},
  {
    // @ts-expect-error this table's meta has no `dateRange`
    columns: () => [{ key: 'name', Cell: DateCell }],
    data: () => people,
  },
);

void badList;
