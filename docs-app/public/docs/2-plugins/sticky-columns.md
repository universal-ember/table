# Sticky columns

API Documentation available [here][api-docs]

[api-docs]: /api/modules/plugins_sticky_columns

<div class="featured-demo" data-demo-fit data-demo-tight>

```gjs live preview no-shadow
import Component from "@glimmer/component";

import { headlessTable } from "@universal-ember/table";
import {
  StickyColumns,
  isSticky,
  styleStringFor,
} from "@universal-ember/table/plugins/sticky-columns";
import { ColumnResizing } from "@universal-ember/table/plugins/column-resizing";
import { ColumnVisibility } from "@universal-ember/table/plugins/column-visibility";

import { DATA } from "#sample-data";

const minWidth = () => ColumnResizing.forColumn(() => ({ minWidth: 150 }));
const leftSticky = () => StickyColumns.forColumn(() => ({ sticky: "left" }));
const rightSticky = () => StickyColumns.forColumn(() => ({ sticky: "right" }));

export default class Demo extends Component {
  table = headlessTable(this, {
    columns: () => [
      { name: "column A", key: "A", pluginOptions: [leftSticky(), minWidth()] },
      { name: "column B", key: "B", pluginOptions: [minWidth()] },
      { name: "column C", key: "C", pluginOptions: [minWidth()] },
      { name: "column D", key: "D", pluginOptions: [minWidth()] },
      { name: "column E", key: "E", pluginOptions: [minWidth()] },
      { name: "column F", key: "F", pluginOptions: [minWidth()] },
      {
        name: "column G",
        key: "G",
        pluginOptions: [rightSticky(), minWidth()],
      },
    ],
    data: () => DATA,
    plugins: [
      StickyColumns.with(() => ({
        // See:
        //  https://github.com/emberjs/rfcs/pull/883
        workaroundForModifierTimingUpdateRFC883: true,
      })),
      ColumnResizing,
    ],
  });

  <template>
    <div class="h-full overflow-auto" {{this.table.modifiers.container}}>
      <table>
        <thead>
          <tr class="relative">
            {{#each this.table.columns as |column|}}
              <th
                {{this.table.modifiers.columnHeader column}}
                class="{{if (isSticky column) 'bg-[#338]'}}"
                style="{{styleStringFor column}}"
              >
                <span class="name">{{column.name}}</span><br />
              </th>
            {{/each}}
          </tr>
        </thead>
        <tbody>
          {{#each this.table.rows as |row|}}
            <tr class="relative">
              {{#each this.table.columns as |column|}}
                <td
                  class="{{if (isSticky column) 'bg-[#338]'}}"
                  style="{{styleStringFor column}}"
                >
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
import { StickyColumns } from "@universal-ember/table/plugins/sticky-columns";
import { ColumnResizing } from "@universal-ember/table/plugins/column-resizing";

// ...
// in a class
table = headlessTable(this, {
  columns: () => [
    ,
    /* ... */ {
      /* ... */
      pluginOptions: [StickyColumns.forColumn(() => ({ sticky: "right" }))],
    },
  ],
  data: () => [
    /* ... */
  ],
  plugins: [ColumnResizing, StickyColumns],
});
```

Note that the `ColumnResizing` plugin is required because `StickyColumns` needs a guarantee
that a `columnWidth` implementation exists so that columns may become sticky beyond just the
far left and far right columns.

### ColumnOptions

- `sticky`
  - valid values: `"left"`, `"right"`, `false`
  - tells the plugin which columns to make sticky (and to which side of the table)
  - default value is `false`

### TableOptions

None

### Preferences

None

### Accessibility

If making sticky-columns a user-configurable feature,
it's recommended to use `<button>`s or radio inputs for configuring if a column sticks at all, or to the left or right side.

### Helpers + StrictMode

There are convenience helpers for aiding in more ergonomic template usage when using this plugin.

```gjs
import {
  StickyColumns,
  isSticky,
} from "@universal-ember/table/plugins/sticky-columns";

export const THead = <template>
  <thead>
    <tr>
      {{#each @columns as |column|}}
        <th
          data-sticky="{{isSticky column}}"
          {{this.table.modifiers.columnHeader column}}
        >
          <span>{{column.name}}</span><br />
        </th>
      {{/each}}
    </tr>
  </thead>
</template>;
```
