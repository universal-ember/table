import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

import { headlessTable } from '@universal-ember/table';
import { hasPlugin } from '@universal-ember/table/plugins';
import { ColumnResizing } from '@universal-ember/table/plugins/column-resizing';
import { DataSorting } from '@universal-ember/table/plugins/data-sorting';

module('Plugins | Queries | hasPlugin', function (hooks) {
  setupTest(hooks);

  test('it works', function (assert) {
    let table = headlessTable(this, {
      columns: () => [],
      data: () => [],
      plugins: [DataSorting],
    });

    assert.true(hasPlugin(table, DataSorting), 'has DataSorting');
    assert.false(
      hasPlugin(table, ColumnResizing),
      'does not have ColumnResizing',
    );
  });
});
