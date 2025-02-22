import { DataSorting } from '../../plugins/data-sorting';
import { RowSelection } from '../../plugins/row-selection';

import type { SortItem } from '../../plugins/data-sorting';

RowSelection.with(() => {
  const simpleOptions = {
    selection: new Set<number>(),
    onSelect: (item: number) => console.debug(item),
    onDeselect: (item: number) => console.debug(item),
  };

  return simpleOptions;
});

DataSorting.with(() => {
  const simpleOptions = {
    onSort: (sorts: SortItem<number>[]) => console.debug(sorts),
    sorts: [] as unknown as SortItem<number>[],
  };

  return simpleOptions;
});
