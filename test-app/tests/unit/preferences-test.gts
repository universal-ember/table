import { render, settled } from "@ember/test-helpers";
import { module, test } from "qunit";
import { setupRenderingTest, setupTest } from "ember-qunit";
import { setOwner } from "@ember/owner";

import { headlessTable, TablePreferences } from "@universal-ember/table";
import {
  ColumnReordering,
  moveLeft,
} from "@universal-ember/table/plugins/column-reordering";
import { meta } from "@universal-ember/table/plugins";

// import sinon from 'sinon';
import type { PreferencesData } from "@universal-ember/table";

module("Unit | -private | table-preferences", function (hooks) {
  setupTest(hooks);

  module("#restore", function () {
    test("@adapter#restore(): returns initial data for table preferences", async function (assert) {
      assert.expect(1);

      let preferences = new TablePreferences("preferences-key", {
        // Deliberately testing incorrect type

        // @ts-ignore
        restore: () => ({
          columns: {
            foo: { isVisible: true },
            bar: { isVisible: false },
          },
        }),
        persist: (_key, data) => {
          assert.deepEqual(data, {
            plugins: {},
          });
        },
      });

      preferences.persist();
    });
  });

  module("#restore and #persist are inverses", function () {
    test("with plugin data", async function (assert) {
      assert.expect(2);

      let data: PreferencesData = {
        plugins: {
          "column-visibility": {
            table: {
              foo: 2,
            },
            columns: {
              // @ts-expect-error deliberate typo
              foo: { isVilable: true },
              // @ts-expect-error deliberate typo
              bar: { isVilable: true },
            },
          },
        },
      };

      let preferences = new TablePreferences("preferences-key", {
        restore: () => data,
        persist: (key, toPersist) => {
          assert.strictEqual(key, "preferences-key");
          assert.deepEqual(toPersist, data);
        },
      });

      preferences.persist();
    });

    test("unexpected keys are omitted from persist", async function (assert) {
      assert.expect(2);

      let data = {
        foo: 1,
        bar: 2,
      };

      let preferences = new TablePreferences("preferences-key", {
        // Deliberately testing incorrect type

        // @ts-ignore
        restore: () => data,
        persist: (key, toPersist) => {
          assert.strictEqual(key, "preferences-key");
          assert.deepEqual(toPersist, { plugins: {} });
        },
      });

      preferences.persist();
    });
  });

  module("plugins", function () {
    test("can interact with the TrackedMaps (get and set)", async function (assert) {
      assert.expect(5);

      let data: PreferencesData = {
        plugins: {
          "column-visibility": {
            table: {
              foo: 2,
            },
            columns: {
              // @ts-expect-error deliberate non-existent
              foo: { woop: false },
              // @ts-expect-error deliberate non-existent
              bar: { woop: true },
            },
          },
        },
      };
      let preferences = new TablePreferences("preferences-key", {
        restore: () => data,
        persist: (key, toPersist) => {
          assert.deepEqual(toPersist, {
            plugins: {
              "column-visibility": {
                table: { foo: 3 },
                columns: {
                  // @ts-expect-error deliberate non-existent
                  bar: { woop: true },
                  // @ts-expect-error deliberate non-existent
                  foo: { woop: true },
                },
              },
            },
          });
        },
      });

      let foo = preferences.storage
        .forPlugin("column-visibility")
        .table.get("foo");
      let woop = preferences.storage
        .forPlugin("column-visibility")
        .forColumn("foo")
        .get("woop");

      assert.strictEqual(foo, 2);
      assert.false(woop);

      preferences.storage
        .forPlugin("column-visibility")
        .forColumn("foo")
        .set("woop", true);
      preferences.storage.forPlugin("column-visibility").table.set("foo", 3);

      foo = preferences.storage.forPlugin("column-visibility").table.get("foo");
      woop = preferences.storage
        .forPlugin("column-visibility")
        .forColumn("foo")
        .get("woop");

      assert.strictEqual(foo, 3);
      assert.true(woop);
      preferences.persist();
    });

    test("can be deleted", async function (assert) {
      assert.expect(3);

      let data: PreferencesData = {
        plugins: {
          "column-visibility": {
            table: {
              foo: 2,
            },
            columns: {
              // @ts-expect-error deliberate non-existent
              foo: { woop: false },
              // @ts-expect-error deliberate non-existent
              bar: { woop: true },
            },
          },
        },
      };
      let preferences = new TablePreferences("preferences-key", {
        restore: () => data,
        persist: (key, toPersist) => {
          assert.deepEqual(toPersist, {
            plugins: {
              "column-visibility": {
                table: {},
                columns: {
                  foo: {},
                  // @ts-expect-error deliberate non-existent
                  bar: { woop: true },
                },
              },
            },
          });
        },
      });

      preferences.storage.forPlugin("column-visibility").table.delete("foo");
      preferences.storage
        .forPlugin("column-visibility")
        .forColumn("foo")
        .delete("woop");

      let foo = preferences.storage
        .forPlugin("column-visibility")
        .table.get("foo");
      let woop = preferences.storage
        .forPlugin("column-visibility")
        .forColumn("foo")
        .get("woop");

      assert.strictEqual(foo, undefined);
      assert.strictEqual(woop, undefined);
      preferences.persist();
    });

    test(`do not interfere with other plugin's data`, async function (assert) {
      assert.expect(1);

      let data: PreferencesData = {
        plugins: {
          "column-visibility": {
            table: {
              foo: 2,
            },
            columns: {
              // @ts-expect-error deliberate non-existent
              foo: { woop: false },
              // @ts-expect-error deliberate non-existent
              bar: { woop: true },
            },
          },
        },
      };

      let preferences = new TablePreferences("preferences-key", {
        restore: () => data,
        persist: (key, toPersist) => {
          assert.deepEqual(toPersist, {
            plugins: {
              "column-visibility": {
                table: { foo: 2 },
                columns: {
                  // @ts-expect-error deliberate non-existent
                  bar: { woop: true },
                  // @ts-expect-error deliberate non-existent
                  foo: { woop: true },
                },
              },
              "old-plugin": {
                table: {},
                columns: {
                  foo: {
                    woop: 2,
                  },
                },
              },
              "test-plugin": {
                table: {},
                columns: {
                  foo: {
                    woop: "1",
                  },
                },
              },
            },
          });
        },
      });

      preferences.storage
        .forPlugin("column-visibility")
        .forColumn("foo")
        .set("woop", true);
      preferences.storage
        .forPlugin("test-plugin")
        .forColumn("foo")
        .set("woop", "1");
      preferences.storage
        .forPlugin("old-plugin")
        .forColumn("foo")
        .set("woop", 2);
      preferences.persist();
    });
  });
});

module("Preferences | rendering", function (hooks) {
  setupRenderingTest(hooks);

  test("restored preferences are reactive", async function (assert) {
    let data: PreferencesData = {
      plugins: {
        "column-visibility": {
          table: {
            foo: 2,
          },
          columns: {
            // @ts-expect-error deliberate non-existent
            foo: { woop: false },
            // @ts-expect-error deliberate non-existent
            bar: { woop: true },
          },
        },
      },
    };

    let preferences = new TablePreferences("preferences-key", {
      restore: () => data,
    });

    class Context {
      get tableInfo(): string {
        // @ts-expect-error deliberate type mismatch
        return preferences.storage
          .forPlugin("column-visibility")
          .table.get("foo");
      }

      get columnInfo(): string {
        // @ts-expect-error deliberate type mismatch
        return preferences.storage
          .forPlugin("column-visibility")
          .forColumn("foo")
          .get("woop");
      }
    }

    let ctx = new Context();

    await render(
      <template>
        <out id="table">{{ctx.tableInfo}}</out>
        <out id="column">{{ctx.columnInfo}}</out>
      </template>,
    );

    assert.dom("#table").hasText("2");
    assert.dom("#column").hasText("false");

    preferences.storage
      .forPlugin("column-visibility")
      .forColumn("foo")
      .set("woop", true);
    preferences.storage.forPlugin("column-visibility").table.set("foo", 3);

    await settled();

    assert.dom("#table").hasText("3");
    assert.dom("#column").hasText("true");
  });

  test("calling restore() with new data triggers reactivity", async function (assert) {
    // Start with initial preferences
    let initialData: PreferencesData = {
      plugins: {
        ColumnVisibility: {
          table: {},
          columns: {
            "col-a": { isVisible: true },
          },
        },
      },
    };

    let preferences = new TablePreferences("preferences-key", {
      restore: () => initialData,
    });

    class Context {
      get colAVisible(): string {
        const value = preferences.storage
          .forPlugin("ColumnVisibility")
          .forColumn("col-a")
          .get("isVisible");

        return value === undefined ? "undefined" : `${value as boolean}`;
      }
    }

    let ctx = new Context();

    await render(
      <template>
        <out id="visibility">{{ctx.colAVisible}}</out>
      </template>,
    );

    assert.dom("#visibility").hasText("true", "initial value is true");

    // Now restore with NEW data - this should trigger reactivity
    let newData: PreferencesData = {
      plugins: {
        ColumnVisibility: {
          table: {},
          columns: {
            "col-a": { isVisible: false },
          },
        },
      },
    };

    preferences.storage.restore(newData);

    await settled();

    assert.dom("#visibility").hasText("false", "value updates after restore()");
  });

  test("ColumnReordering reacts to restored preferences", async function (assert) {
    class Ctx {
      table = headlessTable(this, {
        columns: () => [{ key: "A" }, { key: "B" }, { key: "C" }],
        data: () => [],
        preferences: {
          key: "test-reorder",
          adapter: {
            restore: () => undefined, // Start with no saved preferences
            persist: () => {},
          },
        },
        plugins: [ColumnReordering],
      });

      get columnOrder() {
        return meta
          .forTable(this.table, ColumnReordering)
          .columns.map((c) => c.key)
          .join(" ");
      }
    }

    let ctx = new Ctx();
    setOwner(ctx, this.owner);

    await render(
      <template>
        <out id="order">{{ctx.columnOrder}}</out>
      </template>,
    );

    assert.dom("#order").hasText("A B C", "initial order is default");

    // Restore preferences with a different order
    ctx.table.preferences.storage.restore({
      plugins: {
        ColumnReordering: {
          table: {
            order: { A: 2, B: 0, C: 1 },
          },
          columns: {},
        },
      },
    });

    await settled();

    assert.dom("#order").hasText("B C A", "order updates after restore()");
  });

  /**
   * This test demonstrates the need for preferences to support thunks.
   *
   * When multiple tables share the same preferences adapter, reordering columns
   * in one table should cause the other table to also update (since they share
   * the same persisted preferences).
   *
   * Currently, preferences is only read once at table initialization, so when
   * one table persists new preferences, the other table doesn't re-read them.
   *
   * If preferences supported a thunk (like columns and data do), the adapter
   * could be re-evaluated and both tables would react to changes.
   */
  test("Multiple tables with same adapter should both react to preference changes (thunk support needed)", async function (assert) {
    // Shared preferences storage - simulates localStorage or an API
    let storedPreferences: PreferencesData | undefined = undefined;

    // Both tables share this adapter - changes from one should affect the other
    const sharedAdapter = {
      restore: () => storedPreferences,
      persist: (_key: string, data: PreferencesData) => {
        storedPreferences = data;
      },
    };

    class Table1Ctx {
      table = headlessTable(this, {
        columns: () => [{ key: "A" }, { key: "B" }, { key: "C" }],
        data: () => [],
        preferences: {
          key: "shared-prefs",
          adapter: sharedAdapter,
        },
        plugins: [ColumnReordering],
      });

      get columnOrder() {
        return meta
          .forTable(this.table, ColumnReordering)
          .columns.map((c) => c.key)
          .join(" ");
      }

      get columns() {
        return meta.forTable(this.table, ColumnReordering).columns;
      }
    }

    class Table2Ctx {
      table = headlessTable(this, {
        columns: () => [{ key: "A" }, { key: "B" }, { key: "C" }],
        data: () => [],
        preferences: {
          key: "shared-prefs",
          adapter: sharedAdapter,
        },
        plugins: [ColumnReordering],
      });

      get columnOrder() {
        return meta
          .forTable(this.table, ColumnReordering)
          .columns.map((c) => c.key)
          .join(" ");
      }
    }

    let table1 = new Table1Ctx();
    let table2 = new Table2Ctx();
    setOwner(table1, this.owner);
    setOwner(table2, this.owner);

    await render(
      <template>
        <out id="table1-order">{{table1.columnOrder}}</out>
        <out id="table2-order">{{table2.columnOrder}}</out>
      </template>,
    );

    // Initially, both tables have default column order
    assert.dom("#table1-order").hasText("A B C", "table1 initial order");
    assert.dom("#table2-order").hasText("A B C", "table2 initial order");

    // Move column B to the left in table1 (making order: B A C)
    // This persists the new order to the shared adapter
    const columnB = table1.columns.find((c) => c.key === "B")!;
    moveLeft(columnB);

    await settled();

    // Table1 should update (it's the one we interacted with)
    assert.dom("#table1-order").hasText("B A C", "table1 updates after moveLeft");

    // Table2 SHOULD also update since it shares the same adapter,
    // but currently it doesn't because preferences is only read once.
    // If preferences was a thunk, both tables would react to the change.
    assert.dom("#table2-order").hasText(
      "B A C",
      "table2 should also react to shared preference change",
    );
  });
});
