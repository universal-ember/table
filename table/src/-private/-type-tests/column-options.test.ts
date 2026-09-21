import { expectTypeOf } from 'expect-type';

import { column, headlessTable } from '../../index.ts';

import type {
  CellArgs,
  CellContext,
  CellOptions,
  ColumnConfig,
} from '../../index.ts';
import type { ComponentLike } from '@glint/template';

interface Person {
  name: string;
  age: number;
}

declare const UnitCell: ComponentLike<CellArgs<Person, { unit: string }>>;
declare const PlainCell: ComponentLike<CellContext<Person>>;
declare const people: Person[];

const col = column<Person>();

/////////////////////////////////////////////
// Each column checks its own Cell against its own options
expectTypeOf(
  col({ key: 'age', Cell: UnitCell, options: () => ({ unit: 'years' }) }),
).toEqualTypeOf<ColumnConfig<Person>>();

// @ts-expect-error wrong option type
col({ key: 'age', Cell: UnitCell, options: () => ({ unit: 42 }) });

// @ts-expect-error missing option
col({ key: 'age', Cell: UnitCell, options: () => ({}) });

// @ts-expect-error Cell is for other row data
column<{ other: number }>()({ key: 'other', Cell: UnitCell });

/////////////////////////////////////////////
// Columns without `column()` keep working, and T is still inferred
const table = headlessTable(
  {},
  {
    columns: () => [
      { key: 'name', Cell: PlainCell },
      { key: 'name2', options: () => ({ anything: 1 }) },
      col({ key: 'age', Cell: UnitCell, options: () => ({ unit: 'years' }) }),
    ],
    data: () => people,
  },
);

expectTypeOf(table.rows[0]!.data).toEqualTypeOf<Person>();

/////////////////////////////////////////////
// Column meta is declared once per app, and needs no row
declare module '../../index.ts' {
  interface ColumnMeta<T> {
    align?: 'left' | 'right';
    exportValue?: (data: T) => string;
  }
}

const aligned = headlessTable(
  {},
  {
    columns: () => [
      {
        key: 'age',
        meta: { align: 'right' as const, exportValue: (person) => person.name },
      },
    ],
    data: () => people,
  },
);

expectTypeOf(aligned.columns[0]!.meta?.align).toEqualTypeOf<
  'left' | 'right' | undefined
>();

headlessTable(
  {},
  {
    // @ts-expect-error not one of the declared alignments
    columns: () => [{ key: 'age', meta: { align: 'middle' } }],
    data: () => people,
  },
);

/////////////////////////////////////////////
// `column.Cell` can be rendered with or without `@options`
type PlainCellArgs =
  NonNullable<(typeof table.columns)[0]['Cell']> extends ComponentLike<
    infer Args
  >
    ? Args
    : never;

expectTypeOf<{
  row: (typeof table.rows)[0];
  column: (typeof table.columns)[0];
}>().toMatchTypeOf<PlainCellArgs>();
