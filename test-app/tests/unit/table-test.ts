import { setOwner } from '@ember/owner';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

import { headlessTable } from '@universal-ember/table';
import { use } from 'ember-resources';

import type {
  ColumnConfig,
  TableConfig,
  TableMeta,
} from '@universal-ember/table';

type Args = Omit<TableConfig<unknown>, 'meta' | 'preferences'> &
  TableMeta & { preferencesKey?: string; title?: string };

function withTestDefaults(
  args: Args,
  extra: Partial<TableConfig<unknown>> = {},
) {
  return {
    columns: args.columns,
    data: args.data,

    ...extra,
  };
}

module('Unit | -private | table', function (hooks) {
  setupTest(hooks);

  test('supports @use', async function (assert) {
    class TestObject {
      @use table = headlessTable({
        columns: () => [
          { key: 'firstName', name: 'First name' },
          { key: 'lastName', name: 'Last name' },
        ],
        data: () => [],
      });
    }

    let instance = new TestObject();

    setOwner(instance, this.owner);

    assert.expect(2);

    ['firstName', 'lastName'].forEach((key, position) => {
      assert.strictEqual(instance.table.columns[position]?.key, key);
    });
  });

  test('columns: is empty by default when no data is passed', async function (assert) {
    const args: Args = {
      columns: () => [],
      data: () => [],
    };

    const table = headlessTable(this, withTestDefaults(args, {}));

    assert.deepEqual(table.columns.values(), []);
  });

  test('columns: each have a key', async function (assert) {
    const args: Args = {
      columns: () =>
        [
          { key: 'firstName', name: 'First name' },
          { key: 'lastName', name: 'Last name' },
          { key: 'role', name: 'Role' },
          { key: 'favouritePet', name: 'Favourite Pet' },
        ] as ColumnConfig[],
      data: () => [],
    };

    const table = headlessTable(this, withTestDefaults(args, {}));

    assert.expect(4);

    ['firstName', 'lastName', 'role', 'favouritePet'].forEach(
      (key, position) => {
        assert.strictEqual(table.columns[position]?.key, key);
      },
    );
  });

  test('columns: each key must be unique', async function (assert) {
    const table = headlessTable(this, {
      columns: () =>
        [
          { key: 'firstName', name: 'First name' },
          { key: 'role', name: 'Role' },
          { key: 'favouritePet', name: 'Favourite Pet' },
          { key: 'firstName', name: 'Last name (typo)' },
        ] as ColumnConfig[],
      data: () => [],
    });

    assert.throws(
      () => {
        table.columns.values();
      },
      /Every column key in the table's column config must be unique. Found duplicate entry: firstName/,
      'expected error received',
    );
  });

  test('defaultCellValue: uses table-level default when no column default is specified', async function (assert) {
    const table = headlessTable(this, {
      columns: () => [
        { key: 'firstName', name: 'First name' },
        { key: 'missing', name: 'Missing column' },
      ],
      data: () => [{ firstName: 'John' }],
      defaultCellValue: 'N/A',
    });

    const row = table.rows[0];
    const firstNameColumn = table.columns[0];
    const missingColumn = table.columns[1];

    assert.strictEqual(
      firstNameColumn?.getValueForRow(row),
      'John',
      'column with data shows actual value',
    );
    assert.strictEqual(
      missingColumn?.getValueForRow(row),
      'N/A',
      'column without data shows table-level default',
    );
  });

  test('defaultCellValue: column-level default overrides table-level default', async function (assert) {
    const table = headlessTable(this, {
      columns: () => [
        {
          key: 'missing1',
          name: 'Missing 1',
          options: () => ({ defaultValue: '???' }),
        },
        { key: 'missing2', name: 'Missing 2' },
      ],
      data: () => [{}],
      defaultCellValue: 'N/A',
    });

    const row = table.rows[0];
    const column1 = table.columns[0];
    const column2 = table.columns[1];

    assert.strictEqual(
      column1?.getValueForRow(row),
      '???',
      'column-level default overrides table-level default',
    );
    assert.strictEqual(
      column2?.getValueForRow(row),
      'N/A',
      'column without specific default uses table-level default',
    );
  });

  test('defaultCellValue: uses default "--" when no defaults are configured', async function (assert) {
    const table = headlessTable(this, {
      columns: () => [{ key: 'missing', name: 'Missing column' }],
      data: () => [{}],
    });

    const row = table.rows[0];
    const column = table.columns[0];

    assert.strictEqual(
      column?.getValueForRow(row),
      '--',
      'uses built-in default when no defaults are configured',
    );
  });
});
