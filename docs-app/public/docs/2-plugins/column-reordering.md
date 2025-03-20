# Column reordering

API Documentation available [here][api-docs]

[api-docs]: /api/modules/plugins_column_reordering

<div class="featured-demo" data-demo-fit data-demo-tight>

```gjs live preview no-shadow
import Component from '@glimmer/component';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';

import { headlessTable } from '@universal-ember/table';
import { meta, columns } from '@universal-ember/table/plugins';
import {
  ColumnReordering,
  moveLeft, moveRight
} from '@universal-ember/table/plugins/column-reordering';

import { DATA } from '#sample-data';

export default class extends Component {
  table = headlessTable(this, {
    columns: () => [
      { name: 'column A', key: 'A' },
      { name: 'column B', key: 'B' },
      { name: 'column C', key: 'C' },
      { name: 'column D', key: 'D' },
    ],
    data: () => DATA,
    plugins: [
      ColumnReordering,
    ],
  });

  get columns() {
    return columns.for(this.table);
  }

  <template>
    <div class="h-full overflow-auto" {{this.table.modifiers.container}}>
      <table>
        <thead>
          <tr>
            {{#each this.columns as |column|}}
              <th {{this.table.modifiers.columnHeader column}} class="relative group">
                <span class="name">{{column.name}}</span><br>
                <button class="left" {{on 'click' (fn moveLeft column)}}>
                  ⇦
                </button>
                <button {{on 'click' (fn moveRight column)}}>
                  ⇨
                </button>
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
```

</div>

## Usage

```js
import { headlessTable } from "@universal-ember/table";
import { ColumnReordering } from "@universal-ember/table/plugins/column-reordering";

// ...
// in a class
table = headlessTable(this, {
  columns: () => [
    /* ... */
  ],
  data: () => [
    /* ... */
  ],
  plugins: [ColumnReordering],
});
```

### ColumnOptions

None

### TableOptions

None

### Preferences

The order of columns will be represented in the preferences.

```js
"ColumnReordering": {
  "columns": {},
  "table": {
    "order": {
      "A": 1,
      "B": 2,
      "C": 3,
      "D": 4
    }
  }
}
```

### Accessibility

It's recommended to use `<button>`s for changing the order of columns.
These buttons could be in a menu for the overall table settings,
but the important things to make sure exist are:

- buttons are focusable
- buttons can be navigated to and pressed via keyboard
- buttons can be navigated to and pressed via screen reader tool

### Helpers + StrictMode

There are convenience helpers for aiding in more ergonomic template usage when using this plugin.

```gjs
import { fn } from "@ember/helper";
import { on } from "@ember/modifier";
import {
  moveLeft,
  moveRight,
  cannotMoveLeft,
  cannotMoveRight,
} from "@universal-ember/table/plugins/column-reordering";

export const THead = <template>
  <thead>
    <tr>
      {{#each @columns as |column|}}
        <th {{@table.modifiers.columnHeader column}}>
          <span>{{column.name}}</span><br />
          <button
            {{on "click" (fn moveLeft column)}}
            disabled={{cannotMoveLeft column}}
          >
            ⇦
          </button>
          <button
            {{on "click" (fn moveRight column)}}
            disabled={{cannotMoveRight column}}
          >
            ⇨
          </button>
        </th>
      {{/each}}
    </tr>
  </thead>
</template>;
```
