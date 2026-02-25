# Data sorting

API Documentation available [here][api-docs]

[api-docs]: /api/modules/plugins_data-sorting

<div class="featured-demo" data-demo-fit data-demo-tight>

```gjs live preview no-shadow
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { fn } from "@ember/helper";
import { on } from "@ember/modifier";

import { headlessTable } from "@universal-ember/table";
import { meta } from "@universal-ember/table/plugins";
import {
  DataSorting,
  sortDescending,
  sortAscending,
  sortDirection,
} from "@universal-ember/table/plugins/data-sorting";

import { DATA } from "docs-app/sample-data";

export default class extends Component {
  table = headlessTable(this, {
    columns: () => [
      { name: "column A", key: "A" },
      { name: "column B", key: "B" },
      { name: "column C", key: "C" },
      { name: "column D", key: "D" },
    ],
    data: () => this.data,
    plugins: [
      DataSorting.with(() => ({
        sorts: this.sorts,
        onSort: (sorts) => (this.sorts = sorts),
      })),
    ],
  });

  @tracked sorts = [];

  get data() {
    return sort(DATA, this.sorts);
  }

  <template>
    <div class="h-full overflow-auto" {{this.table.modifiers.container}}>
      <table>
        <thead>
          <tr>
            {{#each this.table.columns as |column|}}
              <th
                {{this.table.modifiers.columnHeader column}}
                class="relative group"
              >
                <span class="name">{{column.name}}</span><br />
                <button {{on "click" (fn sortAscending column)}}>
                  ⇧
                </button>
                <button {{on "click" (fn sortDescending column)}}>
                  ⇩
                </button>
              </th>
            {{/each}}
          </tr>
        </thead>
        <tbody>
          {{#each this.table.rows as |row|}}
            <tr>
              {{#each this.table.columns as |column|}}
                <td>
                  {{column.getValueForRow row}}
                </td>
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

import { compare } from "@ember/utils";

function hasOwnProperty(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

function getValue(obj, key) {
  if (hasOwnProperty(obj, key)) return obj[key];
}

export function sort(data, sorts) {
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
        return direction === "descending" ? -result : result;
      }
    }

    return 0;
  });
}
```

</div>

## Usage

### ColumnOptions

None

### TableOptions

None

### Preferences

None

### Accessibility

It's recommended to use `<button>`s for sorting columns.

- buttons are focusable
- buttons can be navigated to and pressed via keyboard
- buttons can be navigated to and pressed via screen reader tool

[aria-sort](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-sort)
will be added and updated for you, via the `columnHeader` modifiers.
