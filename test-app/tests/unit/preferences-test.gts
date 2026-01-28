import { render, settled } from "@ember/test-helpers";
import { module, test } from "qunit";
import { setupRenderingTest, setupTest } from "ember-qunit";

import { TablePreferences } from "@universal-ember/table";

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
});
