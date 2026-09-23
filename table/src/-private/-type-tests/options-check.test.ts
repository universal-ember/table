import { expectTypeOf } from 'expect-type';

import { headlessTable } from '../../index.ts';

import type {
  CellContext,
  CellOptions,
  CellOptionsOf,
  ColumnConfig,
} from '../../index.ts';
import type { ComponentLike } from '@glint/template';

interface Person {
  name: string;
  age: number;
}
declare const people: Person[];

interface Unit {
  unit: string;
}

declare const UnitCell: ComponentLike<CellContext<Person> & { options: Unit }>;
declare const PlainCell: ComponentLike<CellContext<Person>>;

/////////////////////////////////////////////
// A column whose Cell asks for `@options` gives them through its `options`
headlessTable(
  {},
  {
    columns: () => [
      { key: 'age', Cell: UnitCell, options: () => ({ unit: 'years' }) },
      { key: 'name', Cell: PlainCell },
    ],
    data: () => people,
  },
);

headlessTable(
  {},
  {
    columns: () => [
      {
        key: 'age',
        Cell: UnitCell,
        // @ts-expect-error `unit` is not a number
        options: () => ({ unit: 3 }),
      },
    ],
    data: () => people,
  },
);

headlessTable(
  {},
  {
    columns: () => [
      // @ts-expect-error the Cell asks for `@options`, and the column has no `options`
      { key: 'age', Cell: UnitCell },
    ],
    data: () => people,
  },
);

headlessTable(
  {},
  {
    columns: () => [
      // @ts-expect-error the `options` of another column do not count
      { key: 'age', Cell: UnitCell },
      { key: 'name', options: () => ({ unit: 'years' }) },
    ],
    data: () => people,
  },
);

// The callbacks still see the row, and the column metas are still inferred
const withMeta = headlessTable(
  {},
  {
    columns: () => [
      {
        key: 'age',
        meta: { align: 'right' },
        Cell: UnitCell,
        options: ({ row }) => ({ unit: row.data.age > 1 ? 'years' : 'year' }),
      },
    ],
    data: () => people,
    meta: { currency: 'EUR' },
  },
);

expectTypeOf(withMeta.columns[0]!.meta?.align).toEqualTypeOf<
  'right' | undefined
>();

/////////////////////////////////////////////
// The option types can be named
const unitOptions = (context: CellContext<Person>): CellOptions => ({
  unit: context.row.data.age > 1 ? 'years' : 'year',
});

const declared: ColumnConfig<Person>[] = [{ key: 'age', options: unitOptions }];

expectTypeOf<CellOptionsOf<{ options: Unit }>>().toEqualTypeOf<Unit>();
expectTypeOf<CellOptionsOf<{ groupBy: 'day' }>>().toEqualTypeOf<unknown>();

void declared;
