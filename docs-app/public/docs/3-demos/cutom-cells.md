# Custom cells

Custom components may be used for each column via the [`ColumnConfig`'s `Cell` property][docs-column-Cell].

[docs-column-Cell]: /api/interfaces/index.ColumnConfig#Cell

<div class="featured-demo" data-demo-fit data-demo-tight>

```gjs live preview no-shadow
import Component from "@glimmer/component";

import { headlessTable } from "@universal-ember/table";
import { DATA } from "#sample-data";

// or import a component from elsewhere
class MyCustomComponent extends Component {
  // For demonstration only, converts a string to a color
  get color() {
    let key = this.args.data[this.args.column.key];
    let color = key
      .split("")
      .map((char) => char.charCodeAt(0).toString(16))
      .join("")
      .slice(0, 6);

    return `#${color}`;
  }

  <template>
    <span
      style="box-shadow: 0 2px 6px 2px {{this.color}}"
      class="ml-2 p-1 rounded border border-white"
    >
      {{this.color}}
    </span>
  </template>
}

export default class extends Component {
  table = headlessTable(this, {
    columns: () => [
      { name: "Custom Cell", key: "A", Cell: MyCustomComponent },
      { name: "column B", key: "B" },
      { name: "column C", key: "C" },
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
              <th {{this.table.modifiers.columnHeader column}}>
                <span class="name">{{column.name}}</span><br />
              </th>
            {{/each}}
          </tr>
        </thead>
        <tbody>
          {{#each this.table.rows as |row|}}
            <tr>
              {{#each this.table.columns as |column|}}
                <td {{this.table.modifiers.columnHeader column}}>
                  {{#if column.Cell}}
                    <column.Cell @data={{row.data}} @column={{column}} />
                  {{else}}
                    {{column.getValueForRow row}}
                  {{/if}}
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
