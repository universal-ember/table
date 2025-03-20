# Column visibility

API Documentation available [here][api-docs]

[api-docs]: /api/modules/plugins_column_visibility

<div class="featured-demo" data-demo-fit data-demo-tight>

```gjs live preview no-shadow
import Component from "@glimmer/component";
import { on } from "@ember/modifier";
import { fn } from "@ember/helper";

import { headlessTable } from "@universal-ember/table";
import { meta, columns } from "@universal-ember/table/plugins";
import {
  ColumnVisibility,
  hide,
  show,
} from "@universal-ember/table/plugins/column-visibility";

import { DATA } from "docs-app/sample-data";

export default class extends Component {
  table = headlessTable(this, {
    columns: () => [
      { name: "column A", key: "A" },
      { name: "column B", key: "B" },
      { name: "column C", key: "C" },
      { name: "column D", key: "D" },
    ],
    data: () => DATA,
    plugins: [ColumnVisibility],
  });

  get columns() {
    return columns.for(this.table);
  }

  <template>
    <div class="flex flex-wrap gap-x-4 gap-y-2">
      {{#each this.table.columns as |column|}}
        <div>
          {{column.name}}:
          <button {{on "click" (fn hide column)}}>
            Hide
          </button>
          <button {{on "click" (fn show column)}}>
            Show
          </button>
        </div>
      {{/each}}
    </div>
    <div class="h-full overflow-auto" {{this.table.modifiers.container}}>
      <table>
        <thead>
          <tr>
            {{#each this.columns as |column|}}
              <th
                {{this.table.modifiers.columnHeader column}}
                class="relative group"
              >
                {{column.name}}
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
```

</div>

## Usage

### ColumnOptions

Columns can be individually configured

```js
table = headlessTable(this, {
  columns: () => [
    {
      name: "column A",
      key: "A",
      pluginOptions: [ColumnVisibility.forColumn(() => ({ isVisible: false }))],
    },
    /* ... */
  ],
  /* ... */
});
```

See the API Documentation [here][api-docs] for the full list of options and descriptions.

### TableOptions

None

### Preferences

The visibility state will be stored in preferences, per column.

### Accessibility

It's recommended to use `<button>`s for changing the visibility of columns.
These buttons could be in a menu for the overall table settings,
but the important things to make sure exist are:

- buttons are focusable
- buttons can be navigated to and pressed via keyboard
- buttons can be navigated to and pressed via screen reader tool
