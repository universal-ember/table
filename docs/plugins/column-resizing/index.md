# Column resizing

API Documentation available [here][api-docs]

[api-docs]: /api/modules/plugins_column_resizing

## Usage

```js
import { headlessTable } from '@universal-ember/table';
import { ColumnResizing, resizeHandle } from '@universal-ember/table/plugins/column-resizing';

// ...
// in a class
  table = headlessTable(this, {
    columns: () => [ /* ... */ ],
    data: () => [ /* ... */ ],
    plugins: [
      ColumnResizing,
    ],
  })
```


### ColumnOptions

Columns can be individually configured

```js
table = headlessTable(this, {
  columns: () => [
    {
      name: 'column A',
      key: 'A',
      pluginOptions: [
        ColumnResizing.forColumn(() => ({ minWidth: 200 }))
      ]
    },
    /* ... */
  ],
  /* ... */
})
```

See the API Documentation [here][api-docs] for the full list of options and descriptions.

### TableOptions

```js
table = headlessTable(this, {
  columns: () => [ /* ... */ ],
  plugins: [
    ColumnResizing.with(() => ({ handlePosition: 'right' })),
  ],
})
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


### Helpers + StrictMode

There are convenience helpers for aiding in more ergonomic template usage when using this plugin.

```gjs
import { isResizing, resizeHandle } from '@universal-ember/table/plugins/column-resizing';

export const THead = <template>
  <thead>
    <tr>
      {{#each @columns as |column|}}
        <th {{@table.modifiers.columnHeader column}}>
          <button {{resizeHandle column}} class="resize-handle-styles">
            ↔
          </button>
          {{#if (isResizing column)}}
            <div class="resize-indicator-styles"></div>
          {{/if}}

          <span>{{column.name}}</span><br>
        </th>
      {{/each}}
    </tr>
  </thead>
</template>
```
