import { expectTypeOf } from 'expect-type';

import { headlessTable } from '../../index.ts';
import {
  ColumnReordering,
  moveLeft,
} from '../../plugins/column-reordering/index.ts';
import {
  ColumnVisibility,
  hide,
  isVisible,
} from '../../plugins/column-visibility/index.ts';
import { DataSorting, sort } from '../../plugins/data-sorting/index.ts';
import { meta } from '../../plugins/index.ts';

import type { CellContext, Column, ColumnConfig, Table } from '../../index.ts';
import type { ComponentLike } from '@glint/template';

interface Person {
  name: string;
  age: number;
}
declare const people: Person[];

type GroupedCellArgs = CellContext<Person> & {
  groupBy: 'day' | 'week';
  onUpdate: (value: string) => void;
};

declare const GroupedCell: ComponentLike<GroupedCellArgs>;
declare const GroupByCell: ComponentLike<
  CellContext<Person> & { groupBy: 'day' | 'week' }
>;
declare const UpdateCell: ComponentLike<
  CellContext<Person> & { onUpdate: (value: string) => void }
>;
declare const PlainCell: ComponentLike<CellContext<Person>>;

type CellArgsOf<Cell> =
  NonNullable<Cell> extends ComponentLike<infer Args> ? Args : never;

/////////////////////////////////////////////
// The args of the Cells are inferred, besides `@row` and `@column`
const grouped = headlessTable(
  {},
  {
    columns: () => [{ key: 'name', Cell: GroupedCell }],
    data: () => people,
  },
);

type GroupedArgs = CellArgsOf<(typeof grouped.columns)[0]['Cell']>;

expectTypeOf<GroupedArgs['groupBy']>().toEqualTypeOf<'day' | 'week'>();
expectTypeOf<GroupedArgs['onUpdate']>().toEqualTypeOf<
  (value: string) => void
>();
expectTypeOf<GroupedArgs['row']>().toEqualTypeOf<(typeof grouped.rows)[0]>();

/////////////////////////////////////////////
// Cells that take fewer args fit next to it
const mixed = headlessTable(
  {},
  {
    columns: () => [
      { key: 'name', Cell: PlainCell },
      { key: 'age', Cell: GroupByCell },
      { key: 'both', Cell: GroupedCell },
    ],
    data: () => people,
  },
);

type MixedArgs = CellArgsOf<(typeof mixed.columns)[0]['Cell']>;

expectTypeOf<MixedArgs['groupBy']>().toEqualTypeOf<'day' | 'week'>();
expectTypeOf<MixedArgs['onUpdate']>().toEqualTypeOf<(value: string) => void>();

/////////////////////////////////////////////
// Cells whose extra args do not overlap add up
const separate = headlessTable(
  {},
  {
    columns: () => [
      { key: 'name', Cell: GroupByCell },
      { key: 'age', Cell: UpdateCell },
    ],
    data: () => people,
  },
);

type SeparateArgs = CellArgsOf<(typeof separate.columns)[0]['Cell']>;

expectTypeOf<SeparateArgs['groupBy']>().toEqualTypeOf<'day' | 'week'>();
expectTypeOf<SeparateArgs['onUpdate']>().toEqualTypeOf<
  (value: string) => void
>();

/////////////////////////////////////////////
// A declared type replaces the inferred one

interface ReportCellArgs {
  groupBy: 'day' | 'week';
  onUpdate: (value: string) => void;
}

const declared: ColumnConfig<Person, unknown, unknown, ReportCellArgs>[] = [
  { key: 'name', Cell: GroupByCell },
  { key: 'age', Cell: UpdateCell },
  { key: 'plain', Cell: PlainCell },
];

const fromDeclared = headlessTable(
  {},
  {
    columns: () => declared,
    data: () => people,
  },
);

type DeclaredArgs = CellArgsOf<(typeof fromDeclared.columns)[0]['Cell']>;

expectTypeOf<DeclaredArgs['groupBy']>().toEqualTypeOf<'day' | 'week'>();
expectTypeOf<DeclaredArgs['onUpdate']>().toEqualTypeOf<
  (value: string) => void
>();

declare const NumberGroupCell: ComponentLike<
  CellContext<Person> & { groupBy: number }
>;

const wrongArgs: ColumnConfig<Person, unknown, unknown, ReportCellArgs>[] = [
  {
    key: 'name',
    // @ts-expect-error `groupBy` is not a number
    Cell: NumberGroupCell,
  },
];

/////////////////////////////////////////////
// The row type of a Cell is still checked
declare const OtherRowCell: ComponentLike<
  CellContext<{ other: number }> & { groupBy: 'day' | 'week' }
>;

headlessTable(
  {},
  {
    // @ts-expect-error the Cell is for other rows
    columns: () => [{ key: 'name', Cell: OtherRowCell }],
    data: () => people,
  },
);

/////////////////////////////////////////////
// Without Cells that take args, nothing changes
const plain = headlessTable(
  {},
  {
    columns: () => [{ key: 'name', Cell: PlainCell }, { key: 'age' }],
    data: () => people,
  },
);

expectTypeOf<CellArgsOf<(typeof plain.columns)[0]['Cell']>>().toEqualTypeOf<
  CellContext<Person, unknown, unknown>
>();

/////////////////////////////////////////////
// A column whose Cell takes args fits code that knows nothing about them
function takesAnyColumn(column: Column<Person>) {
  return column.key;
}
function takesAnyTable(table: Table<Person>) {
  return table.columns.length;
}
takesAnyColumn(grouped.columns[0]!);
takesAnyColumn(plain.columns[0]!);
takesAnyTable(grouped);

// The plugin helpers take it too
const withPlugins = headlessTable(
  {},
  {
    columns: () => [{ key: 'name', Cell: GroupedCell }],
    data: () => people,
    meta: { currency: 'EUR' },
    plugins: [ColumnVisibility, DataSorting, ColumnReordering],
  },
);
const groupedColumn = withPlugins.columns[0]!;

expectTypeOf(isVisible(groupedColumn)).toEqualTypeOf<boolean>();
hide(groupedColumn);
sort(groupedColumn);
moveLeft(groupedColumn);
meta.forColumn(groupedColumn, ColumnVisibility);

/////////////////////////////////////////////
// The table of a row has the types of the table, like the table of a column
expectTypeOf(
  withPlugins.rows[0]!.table.config.meta!.currency,
).toEqualTypeOf<string>();

declare const CurrencyCell: ComponentLike<
  CellContext<Person, unknown, { currency: string }>
>;
type CurrencyArgs = CellArgsOf<typeof CurrencyCell>;
expectTypeOf<
  NonNullable<CurrencyArgs['row']['table']['config']['meta']>['currency']
>().toEqualTypeOf<string>();

void wrongArgs;

/////////////////////////////////////////////
// `getOptionsForRow` has the `@options` that the Cells ask for
interface Unit {
  unit: string;
}
declare const UnitCell: ComponentLike<CellContext<Person> & { options: Unit }>;

const withOptions = headlessTable(
  {},
  {
    columns: () => [
      { key: 'age', Cell: UnitCell, options: () => ({ unit: 'years' }) },
      { key: 'name', Cell: PlainCell },
    ],
    data: () => people,
  },
);
declare const optionsRow: (typeof withOptions.rows)[number];
const options = withOptions.columns[0]!.getOptionsForRow(optionsRow);

expectTypeOf(options.unit).toEqualTypeOf<string>();
expectTypeOf(options.defaultValue).toEqualTypeOf<string>();
expectTypeOf(plain.columns[0]!.getOptionsForRow(optionsRow)).toEqualTypeOf<{
  defaultValue: string;
}>();

/////////////////////////////////////////////
// A table meta and a callback with parameters do not stop the inference
const withMetaAndCallback = headlessTable(
  {},
  {
    columns: () => [
      { key: 'name', meta: { align: 'left' }, Cell: GroupedCell },
      { key: 'age', value: ({ row }) => row.data.age },
    ],
    data: () => people,
    meta: { currency: 'EUR' },
  },
);

type MetaAndCallbackArgs = CellArgsOf<
  (typeof withMetaAndCallback.columns)[0]['Cell']
>;

expectTypeOf<MetaAndCallbackArgs['groupBy']>().toEqualTypeOf<'day' | 'week'>();
expectTypeOf(withMetaAndCallback.columns[0]!.meta?.align).toEqualTypeOf<
  'left' | undefined
>();
