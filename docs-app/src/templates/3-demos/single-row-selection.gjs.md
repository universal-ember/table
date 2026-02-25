# Single-row selection

Using the RowSelection plugin, we can select a single row at a time, rather than [multiple rows](/docs/plugins/row-selection), as the plugin page demonstrates.

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
          onSelect: (data) => {
            this.selection.clear();
            this.selection.add(data);
          },
          onDeselect: (data) => this.selection.clear(),
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
