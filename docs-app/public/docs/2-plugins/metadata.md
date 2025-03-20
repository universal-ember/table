# Metadata

API Documentation available [here][api-docs]

[api-docs]: /api/modules/plugins_metadata


<div class="featured-demo" data-demo-fit data-demo-tight>

```gjs live preview no-shadow
import Component from '@glimmer/component';

import { headlessTable } from '@universal-ember/table';
import { Metadata, forColumn, forTable } from '@universal-ember/table/plugins/metadata';

import { DATA } from '#sample-data';

const isBold = (column) => forColumn(column, 'bold');
const captionFor = (table) => forTable(table, 'title');

export default class extends Component {
  table = headlessTable(this, {
    columns: () => [
      { name: 'column A', key: 'A' },
      { name: 'column B', key: 'B',
        pluginOptions: [Metadata.forColumn(() => ({ bold: true }))]
      },
      { name: 'column C', key: 'C' },
    ],
    data: () => DATA,
    plugins: [
      Metadata.with(() => ({
        title: 'This is a table with custom metadata',
      }))
    ],
  });

  <template>
    <div class="h-full overflow-auto" {{this.table.modifiers.container}}>
      <table>
       <caption>{{ (captionFor this.table) }}</caption>
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
                {{#if (isBold column)}}
                  <td class="font-bold">
                    This is a bold column.
                  </td>
                {{else}}
                  <td>
                    {{column.getValueForRow row}}
                  </td>
                {{/if}}
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

Allows arbitrary data to be stored for each column as well as the whole table.
This can be useful eliminating prop-drilling in a UI Table implementation consuming the
headlessTable.

For example, setting up the table can be done like:

```js
import { headlessTable } from '@universal-ember/table';

class Example {
  /* ... */

  table = headlessTable(this, {
    columns: () => [
      { name: 'A', key: 'A' },
      {
        name: 'B',
        key: 'B',
        pluginOptions: [
          Metadata.forColumn(() => ({
            isBulkSelectable: false,
          })),
        ],
      },
      {
        name: 'D',
        key: 'D',
        pluginOptions: [Metadata.forColumn(() => ({ isRad: this.dRed }))],
      },
    ],
    data: () => DATA,
    plugins: [
      Metadata.with(() => ({
        onBulkSelectionChange: (...args) => this.doSomething(...args),
      })),
    ],
  });
}
```

To allow "bulk selection" behaviors to be integrated into how the Table is rendered --
which for fancier tables, my span multiple components.

For example: rows may be their own component

```gjs
// Two helpers are provided for accessing your Metadata
import { forColumn /*, forTable */ } from '@universal-ember/table/plugins/metadata';

const isBulkSelectable = (column) => forColumn(column, 'isBulkSelectable');

export const Row = <template>
  <tr>
    {{#each @table.columns as |column|}}
      {{#if (isBulkSelectable column)}}

        ... render some checkbox UI ...

      {{else}}
        <td>
          {{column.getValueForRow @datum}}
        </td>
      {{/if}}
    {{/each}}
  </tr>
</template>;
```

### ColumnOptions

Any / user-defined.


### TableOptions

Any / user-defined.

### Preferences

None

### Accessibility

Not applicable.
