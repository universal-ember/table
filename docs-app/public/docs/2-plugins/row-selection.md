# Row selection

API Documentation available [here][api-docs]

[api-docs]: /api/modules/plugins_row-selection

This demonstrates how to use the RowSelection plugin to enable multiple row selection.
If single-row selection is desired, that can be handled in userspace, by managing the selection data differently (see the "[single-row-selection](/docs/demos/single-row-selection)" demo).

To select a row, click it. To deselect a row, click it again.

<div class="featured-demo" data-demo-fit data-demo-tight>

```gjs live preview no-shadow
import Component from "@glimmer/component";
import { on } from "@ember/modifier";
import { fn } from "@ember/helper";

import { headlessTable } from "@universal-ember/table";
import { meta } from "@universal-ember/table/plugins";
import { TrackedSet } from "tracked-built-ins";
import {
  RowSelection,
  toggle,
  isSelected,
} from "@universal-ember/table/plugins/row-selection";

import { DATA } from "#sample-data";

export default class extends Component {
  selection = new TrackedSet();

  table = headlessTable(this, {
    columns: () => [
      { name: "column A", key: "A" },
      { name: "column B", key: "B" },
      { name: "column C", key: "C" },
      { name: "column D", key: "D" },
    ],
    data: () => DATA,
    plugins: [
      RowSelection.with(() => {
        return {
          selection: this.selection,
          onSelect: (data) => this.selection.add(data),
          onDeselect: (data) => this.selection.delete(data),
        };
      }),
    ],
  });

  <template>
    <div class="h-full overflow-auto" {{this.table.modifiers.container}}>
      <table>
        <thead>
          <tr>
            <td></td>
            {{#each this.table.columns as |column|}}
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
            <tr
              {{this.table.modifiers.row row}}
              class="{{if (isSelected row) 'bg-[#338]'}}"
            >
              <td>
                <button {{on "click" (fn toggle row)}}>Toggle</button>
              </td>
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

State for what is selected is managed by you, the consumer.
This plugin provides helpful utilities and automatically wires up event listeners for each row.

### ColumnOptions

None

### TableOptions

Required:

- `selection` - a collection of what is already selected
- `onSelect` - event handler for when a row is selected
- `onDeselect` - event handler for when a row is deselected

Optional:

- `key` - a function which will be passed to `onSelect` and `onDeselect` for helping manage "what" is selected. This should be the same data type as the individual elements within the `selection`

See the API Documentation [here][api-docs] for the full list of options and descriptions.

### Preferences

None

### Accessibility

Without a focusable element to trigger a row selection,
keyboard and screen reader users will not be able to select a row.
When using this plugin, ensure that each row has a focusable element that interacts with the selection APIs for that row.
