# Column resizing

API Documentation available [here][api-docs]

[api-docs]: /api/modules/plugins_column-resizing

<div class="featured-demo" data-demo-fit data-demo-tight>

```gjs live preview no-shadow
import Component from "@glimmer/component";
import { htmlSafe } from "@ember/template";

import { headlessTable } from "@universal-ember/table";
import { meta } from "@universal-ember/table/plugins";
import { ColumnVisibility } from "@universal-ember/table/plugins/column-visibility";
import { ColumnReordering } from "@universal-ember/table/plugins/column-reordering";
import {
  ColumnResizing,
  resizeHandle,
  isResizing,
} from "@universal-ember/table/plugins/column-resizing";

import { DATA } from "#sample-data";

export default class extends Component {
  table = headlessTable(this, {
    columns: () => [
      {
        name: "column A",
        key: "A",
        pluginOptions: [ColumnResizing.forColumn(() => ({ minWidth: 100 }))],
      },
      {
        name: "column B",
        key: "B",
        pluginOptions: [ColumnResizing.forColumn(() => ({ minWidth: 100 }))],
      },
      {
        name: "column C",
        key: "C",
        pluginOptions: [ColumnResizing.forColumn(() => ({ minWidth: 100 }))],
      },
    ],
    data: () => DATA,
    plugins: [ColumnResizing],
  });

  get resizeHeight() {
    return htmlSafe(`${this.table.scrollContainerElement.clientHeight - 32}px`);
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
                <button
                  {{resizeHandle column}}
                  class="z-10 reset-styles absolute -left-4 cursor-col-resize focusable group-first:hidden"
                >
                  ↔
                </button>
                {{#if (isResizing column)}}
                  <div
                    class="absolute -left-3 -top-4 bg-focus w-0.5 transition duration-150"
                    style="height: {{this.resizeHeight}}"
                  ></div>
                {{/if}}

                <span class="name">{{column.name}}</span><br />
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
```

</div>

## Usage

```js
import { headlessTable } from "@universal-ember/table";
import {
  ColumnResizing,
  resizeHandle,
} from "@universal-ember/table/plugins/column-resizing";

// ...
// in a class
table = headlessTable(this, {
  columns: () => [
    /* ... */
  ],
  data: () => [
    /* ... */
  ],
  plugins: [ColumnResizing],
});
```

### ColumnOptions

Columns can be individually configured

```js
table = headlessTable(this, {
  columns: () => [
    {
      name: "column A",
      key: "A",
      pluginOptions: [ColumnResizing.forColumn(() => ({ minWidth: 200 }))],
    },
    /* ... */
  ],
  /* ... */
});
```

See the API Documentation [here][api-docs] for the full list of options and descriptions.

### TableOptions

```js
table = headlessTable(this, {
  columns: () => [
    /* ... */
  ],
  plugins: [ColumnResizing.with(() => ({ handlePosition: "right" }))],
});
```

See the API Documentation [here][api-docs] for the full list of options and descriptions.

### Preferences

The width will be stored in preferences, per column.

### Accessibility

It's recommended to use `<button>`s for changing the width of columns.
These buttons can be positioned anywhere in column headings,
but it'll be most important to ensure that tab-order makes sense.

- buttons are focusable
- buttons can be navigated to and pressed via keyboard

This will ensure that keyboard users, as well as mouse users can resize their columns.
