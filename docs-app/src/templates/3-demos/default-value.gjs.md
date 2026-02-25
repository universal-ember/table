# Default values

The default value can be changed at the table level or per-column.

<div class="featured-demo" data-demo-fit data-demo-tight>

```gjs live preview no-shadow
import Component from "@glimmer/component";

import { headlessTable } from "@universal-ember/table";
import { DATA } from "#sample-data";

export default class extends Component {
  table = headlessTable(this, {
    columns: () => [
      {
        name: "Column A",
        key: "missing",
        options: () => ({ defaultValue: "???" }),
      },
      { name: "column B", key: "B" },
      { name: "column C", key: "alsoMissing" },
      { name: "column D", key: "D" },
      { name: "column E", key: "E" },
    ],
    data: () => DATA,
  });

  <template>
    <div class="h-full overflow-auto" {{this.table.modifiers.container}}>
      <table>
        <thead>
          <tr>
            {{#each this.table.columns as |column|}}
              <th>
                {{column.name}}
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

## Table-level default

You can set a default value for all columns using `defaultCellValue` in the table config. This applies to all columns unless overridden by a column-specific `defaultValue`.

<div class="featured-demo" data-demo-fit data-demo-tight>

```gjs live preview no-shadow
import Component from "@glimmer/component";

import { headlessTable } from "@universal-ember/table";
import { DATA } from "#sample-data";

export default class extends Component {
  table = headlessTable(this, {
    columns: () => [
      {
        name: "Column A",
        key: "missing",
        options: () => ({ defaultValue: "???" }), // overrides table default
      },
      { name: "column B", key: "B" },
      { name: "column C", key: "alsoMissing" }, // uses table default
      { name: "column D", key: "D" },
      { name: "column E", key: "E" },
    ],
    data: () => DATA,
    defaultCellValue: "N/A", // table-level default
  });

  <template>
    <div class="h-full overflow-auto" {{this.table.modifiers.container}}>
      <table>
        <thead>
          <tr>
            {{#each this.table.columns as |column|}}
              <th>
                {{column.name}}
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
