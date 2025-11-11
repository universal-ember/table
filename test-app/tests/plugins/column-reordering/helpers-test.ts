import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

import { headlessTable } from '@universal-ember/table';
import { columns } from '@universal-ember/table/plugins';
import {
  ColumnReordering,
  orderedColumnsFor,
  setColumnOrder,
  ColumnOrder,
} from '@universal-ember/table/plugins/column-reordering';

module('Plugins | columnReordering | helpers', function (hooks) {
  setupTest(hooks);

  const DEFAULT_COLUMNS = [
    { name: 'A', key: 'A' },
    { name: 'B', key: 'B' },
    { name: 'C', key: 'C' },
    { name: 'D', key: 'D' },
  ];

  test('orderedColumnsFor returns columns in default order', function (assert) {
    const table = headlessTable(this, {
      columns: () => DEFAULT_COLUMNS,
      data: () => [],
      plugins: [ColumnReordering],
    });

    const orderedColumns = orderedColumnsFor(table);

    assert.strictEqual(orderedColumns.length, 4, 'Should have 4 columns');
    assert.strictEqual(orderedColumns[0]?.key, 'A', 'First column should be A');
    assert.strictEqual(
      orderedColumns[1]?.key,
      'B',
      'Second column should be B',
    );
    assert.strictEqual(orderedColumns[2]?.key, 'C', 'Third column should be C');
    assert.strictEqual(
      orderedColumns[3]?.key,
      'D',
      'Fourth column should be D',
    );
  });

  test('orderedColumnsFor returns columns in custom order after reordering', function (assert) {
    const columnConfigList = [...DEFAULT_COLUMNS];
    const table = headlessTable(this, {
      columns: () => columnConfigList,
      data: () => [],
      plugins: [ColumnReordering],
    });

    // Create a custom order: D, A, C, B
    const customOrder = new ColumnOrder({
      columns: () => columns.for(table),
    });

    // Set the custom order manually
    customOrder.setAll(
      new Map([
        ['D', 0],
        ['A', 1],
        ['C', 2],
        ['B', 3],
      ]),
    );

    setColumnOrder(table, customOrder);

    const orderedColumns = orderedColumnsFor(table);

    assert.strictEqual(orderedColumns.length, 4, 'Should still have 4 columns');
    assert.strictEqual(
      orderedColumns[0]?.key,
      'D',
      'First column should be D after reordering',
    );
    assert.strictEqual(
      orderedColumns[1]?.key,
      'A',
      'Second column should be A after reordering',
    );
    assert.strictEqual(
      orderedColumns[2]?.key,
      'C',
      'Third column should be C after reordering',
    );
    assert.strictEqual(
      orderedColumns[3]?.key,
      'B',
      'Fourth column should be B after reordering',
    );
  });
});
