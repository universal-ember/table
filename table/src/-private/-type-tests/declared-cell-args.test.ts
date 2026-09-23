import { expectTypeOf } from 'expect-type';

import { headlessTable } from '../../index.ts';

import type { CellContext, ColumnConfig } from '../../index.ts';
import type { ComponentLike } from '@glint/template';

interface Person {
  name: string;
}
declare const people: Person[];

interface GroupArgs {
  groupBy: 'day' | 'week';
}

type CellArgsOf<Cell> =
  NonNullable<Cell> extends ComponentLike<infer Args> ? Args : never;

/////////////////////////////////////////////
// A shared component takes a column list from its caller.
// The cell args are a type parameter there, with no Cell to read them from.
function makeTable<T, CellArgs>(
  columns: ColumnConfig<T, unknown, unknown, CellArgs>[],
  data: T[],
) {
  return headlessTable({}, { columns: () => columns, data: () => data });
}

declare const groupColumns: ColumnConfig<Person, unknown, unknown, GroupArgs>[];

const shared = makeTable(groupColumns, people);

expectTypeOf<
  CellArgsOf<(typeof shared.columns)[0]['Cell']>['groupBy']
>().toEqualTypeOf<'day' | 'week'>();

/////////////////////////////////////////////
// A declared list keeps its args, even when no Cell in it asks for them
declare const PlainCell: ComponentLike<CellContext<Person>>;

const declared: ColumnConfig<Person, unknown, unknown, GroupArgs>[] = [
  { key: 'name', Cell: PlainCell },
];
const fromDeclared = headlessTable(
  {},
  { columns: () => declared, data: () => people },
);

expectTypeOf<
  CellArgsOf<(typeof fromDeclared.columns)[0]['Cell']>['groupBy']
>().toEqualTypeOf<'day' | 'week'>();

/////////////////////////////////////////////
// A list written in place still reads its Cells
declare const GroupedCell: ComponentLike<CellContext<Person> & GroupArgs>;

const inPlace = headlessTable(
  {},
  {
    columns: () => [{ key: 'name', Cell: GroupedCell }, { key: 'plain' }],
    data: () => people,
  },
);

expectTypeOf<
  CellArgsOf<(typeof inPlace.columns)[0]['Cell']>['groupBy']
>().toEqualTypeOf<'day' | 'week'>();
