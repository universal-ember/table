import { headlessTable } from '../../index.ts';

import type { CellContext, ColumnConfig } from '../../index.ts';
import type { ComponentLike } from '@glint/template';

interface Person {
  name: string;
  age: number;
}
declare const people: Person[];

/////////////////////////////////////////////
// Each column decides which Cell fits it, through its own meta.
// A Cell is checked against the meta of its column, not of the table.
interface Alignment {
  align: 'left' | 'right';
}
interface Width {
  width: number;
}

declare const AlignedCell: ComponentLike<CellContext<Person, Alignment>>;
declare const WidthCell: ComponentLike<CellContext<Person, Width>>;

headlessTable(
  {},
  {
    columns: () => [
      { key: 'name', meta: { align: 'left' }, Cell: AlignedCell },
      { key: 'age', meta: { width: 80 }, Cell: WidthCell },
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
        meta: { align: 'left' },
        // @ts-expect-error this column's meta has no `width`
        Cell: WidthCell,
      },
      { key: 'age', meta: { width: 80 }, Cell: WidthCell },
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
        // @ts-expect-error a column without meta does not fit a Cell that reads one
        Cell: AlignedCell,
      },
      { key: 'age', meta: { align: 'right' }, Cell: AlignedCell },
    ],
    data: () => people,
  },
);

/////////////////////////////////////////////
// A declared column type decides for every column in the list
const aligned: ColumnConfig<Person, Alignment>[] = [
  { key: 'name', meta: { align: 'left' }, Cell: AlignedCell },
  // @ts-expect-error the list's meta has no `width`
  { key: 'age', meta: { align: 'right' }, Cell: WidthCell },
];

void aligned;
