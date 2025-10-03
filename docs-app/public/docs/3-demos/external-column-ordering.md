# External column (re)ordering

This demo shows how to set the order of columns before _committing_ those changes to the actual table.
This pattern could be used for configuration UIs where a person interacting with the table may want to configure and save their configuration before applying changes.

<div class="featured-demo" data-demo-fit data-demo-tight>

```gjs live preview no-shadow
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';

import { headlessTable } from '@universal-ember/table';
import { meta, columns } from '@universal-ember/table/plugins';
import {
  ColumnReordering,
  ColumnOrder,
  setColumnOrder,
  moveLeft, moveRight
} from '@universal-ember/table/plugins/column-reordering';

import { DATA } from 'docs-app/sample-data';

export default class extends Component {
  @tracked pendingColumnOrder;

  changeColumnOrder = () => {
    // Basic usage (backwards compatible):
    // Pass your columns and they're all treated as visible
    this.pendingColumnOrder = new ColumnOrder({
      columns: () => this.columns,
    });

    // Advanced usage (with ColumnVisibility plugin):
    // Pass ALL columns and provide a visibleColumns map
    // this.pendingColumnOrder = new ColumnOrder({
    //   columns: () => this.table.columns.values(),  // All columns (including hidden)
    //   visibleColumns: () => this.columns.reduce((acc, col) => {
    //     acc[col.key] = meta(col).ColumnVisibility?.isVisible !== false;
    //     return acc;
    //   }, {}),
    // });
  }

  handleReconfigure = () => {
    setColumnOrder(this.table, this.pendingColumnOrder);
    this.pendingColumnOrder = null;
  }


  /**
   * Generic table code below
   */

  table = headlessTable(this, {
    columns: () => [
      { name: 'column A', key: 'A' },
      { name: 'column B', key: 'B' },
      { name: 'column C', key: 'C' },
    ],
    data: () => DATA,
    plugins: [ColumnReordering],
  });

  get columns() {
    return columns.for(this.table);
  }

  <template>
    {{#if this.pendingColumnOrder}}
      <div class="grid gap-4">
        {{#let this.pendingColumnOrder as |order|}}

          <div class="grid gap-4 grid-flow-col">
            {{#each order.orderedColumns as |column|}}
              <div class="flex gap-2">
                <button {{on 'click' (fn order.moveLeft column.key)}}> ⇦ </button>
                {{column.name}}
                <button {{on 'click' (fn order.moveRight column.key)}}> ⇨ </button>
              </div>
            {{/each}}
          </div>

          <button {{on 'click' this.handleReconfigure}}>Submit changes</button>
        {{/let}}
      </div>
    {{else}}
      <button {{on 'click' this.changeColumnOrder}}>
        Configure columns
      </button>
    {{/if}}

    <hr />


    The order of the columns in the table
    (table not rendered for focusing on the configuration)

    <pre>
      {{#each this.columns as |column|}}
        {{column.name}}
      {{/each}}
    </pre>
  </template>
```

</div>
