# Usage

In this example, the column reordering, visibility, resizing, and data sorting plugins are in use.

See the individual plugin pages for more scoped-down examples.

<div class="featured-demo" data-demo-fit data-demo-tight>

```gjs live preview no-shadow
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { htmlSafe } from '@ember/template';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';

import { headlessTable } from '@universal-ember/table';
import { meta, columns } from '@universal-ember/table/plugins';
import { ColumnResizing, isResizing, resizeHandle } from '@universal-ember/table/plugins/column-resizing';
import { ColumnReordering, moveLeft, moveRight, cannotMoveLeft, cannotMoveRight } from '@universal-ember/table/plugins/column-reordering';
import { ColumnVisibility, hide, show, isVisible, isHidden } from '@universal-ember/table/plugins/column-visibility';
import { DataSorting, sort, isAscending, isDescending } from '@universal-ember/table/plugins/data-sorting';

import { DATA } from '#sample-data';

export default class extends Component {
  table = headlessTable(this, {
    columns: () => [
      { name: 'column A', key: 'A',
        pluginOptions: [ColumnResizing.forColumn(() => ({ minWidth: 200 }))]
      },
      { name: 'column B', key: 'B',
        pluginOptions: [ColumnResizing.forColumn(() => ({ minWidth: 200 }))]
      },
      { name: 'column C', key: 'C',
        pluginOptions: [ColumnResizing.forColumn(() => ({ minWidth: 200 }))]
      },
    ],
    data: () => this.data,
    plugins: [
      ColumnReordering,
      ColumnVisibility,
      ColumnResizing,
      DataSorting.with(() => ({
        sorts: this.sorts,
        onSort: (sorts) => this.sorts = sorts,
      })),
    ],
  });

  @tracked sorts = [];

  get columns() {
    return columns.for(this.table);
  }

  get data() {
    return localSort(DATA, this.sorts);
  }

  get resizeHeight() {
    return htmlSafe(`${this.table.scrollContainerElement.clientHeight - 32}px`)
  }

  <template>
    <div class="flex gap-2 text-sm">
      {{#each this.table.columns as |column|}}
        <span>
          {{column.name}}:
          <button {{on 'click' (fn hide column)}} disabled={{isHidden column}}>
            Hide
          </button>
          <button {{on 'click' (fn show column)}} disabled={{isVisible column}}>
            Show
          </button>
        </span>
      {{/each}}
    </div>
    <div class="h-full overflow-auto" {{this.table.modifiers.container}}>
      <table>
        <thead>
          <tr>
            {{#each this.columns as |column|}}
              <th {{this.table.modifiers.columnHeader column}} class="relative group">
                <button {{resizeHandle column}} class="reset-styles absolute -left-4 cursor-col-resize focusable group-first:hidden">
                  ↔
                </button>
                {{#if (isResizing column)}}
                  <div
                    class="absolute -left-3 -top-4 bg-focus w-0.5 transition duration-150"
                    style="height: {{this.resizeHeight}}"></div>
                {{/if}}

                <span class="name">{{column.name}}</span><br>
                <button {{on 'click' (fn moveLeft column)}} disabled={{cannotMoveLeft column}}>
                  ⇦
                </button>
                <button {{on 'click' (fn moveRight column)}} disabled={{cannotMoveRight column}}>
                  ⇨
                </button>
                <button {{on 'click' (fn sort column)}}>
                  {{#if (isAscending column)}}
                    × <span visually-hidden>remove sort</span>
                  {{else if (isDescending column)}}
                    ⇧ <span visually-hidden>switch to ascending sort</span>
                  {{else}}
                    ⇩ <span visually-hidden>switch to ascending sort</span>
                  {{/if}}
                </button>
              </th>
            {{else}}
              <th>
                No columns are visible
              </th>
            {{/each}}
          </tr>
        </thead>
        <tbody>
          {{#each this.table.rows as |row|}}
            <tr>
              {{#each this.columns as |column|}}
                <td>
                  {{column.getValueForRow row}}</td>
              {{/each}}
            </tr>
          {{/each}}
        </tbody>
      </table>
    </div>
  </template>
}

/**
 * Utils, not the focus of the demo.
 * but sorting does need to be handled by you.
 */

import { compare } from '@ember/utils';

function hasOwnProperty(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

function getValue(obj, key) {
  if (hasOwnProperty(obj, key)) return obj[key];
}

export function localSort(data, sorts) {
  // you'll want to sort a duplicate of the array, because Array.prototype.sort mutates.
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
  //
  // Beware though that if the array is reactive,
  //   this will lose the reactivity if copying this function.
  return [...data].sort((itemA, itemB) => {
    for (let { direction, property } of sorts) {
      let valueA = getValue(itemA, property);
      let valueB = getValue(itemB, property);

      let result = compare(valueA, valueB);

      if (result) {
        return direction === 'descending' ? -result : result;
      }
    }

    return 0;
  });
}
```

</div>

## Installation

Use your favorite package manager / installation tool -- the library is called `@universal-ember/table`.

```bash
pnpm add @universal-ember/table
# or
yarn add @universal-ember/table
# or
npm install @universal-ember/table
# or
ember install @universal-ember/table
```


## Compatibility

* ember-auto-import >= v2
* ember-source >= 3.28
* embroider safe + optimized
* typescript >= 5.4
* Glint >= 1.3

  All Glint changes will be considered bugfixes until Glint 1.0 is released.

