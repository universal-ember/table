import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { assert, assert as debugAssert } from "@ember/debug";
import { htmlSafe } from "@ember/template";
import { click, render, settled } from "@ember/test-helpers";
import { module, test, skip } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { setOwner } from "@ember/owner";
import { on } from "@ember/modifier";
import { fn } from "@ember/helper";

import {
  headlessTable,
  type ColumnConfig,
  type PreferencesData,
} from "@universal-ember/table";
import {
  ColumnResizing,
  resizeHandle,
  hasResizeHandle,
} from "@universal-ember/table/plugins/column-resizing";
import { ColumnVisibility } from "@universal-ember/table/plugins/column-visibility";
import {
  ColumnReordering,
  moveLeft,
  moveRight,
} from "@universal-ember/table/plugins/column-reordering";
import {
  createHelpers,
  requestAnimationFrameSettled,
} from "@universal-ember/table/test-support";

import { TestStyles, getColumns, assertChanges, width } from "./utils.gts";

module("Plugins | resizing", function (hooks) {
  setupRenderingTest(hooks);

  let ctx: Context;
  let { dragLeft, dragRight } = createHelpers({
    resizeHandle: "[data-handle]",
  });

  function roomToShrink(element: Element) {
    assert("element must be an HTML element", element instanceof HTMLElement);

    let minWidth = parseInt(element.style.minWidth.replace("px", ""), 10) || 0;

    return width(element) - minWidth;
  }

  class Context {
    @tracked containerWidth = 1000;

    columns: ColumnConfig[] = [
      { name: "A", key: "A" },
      { name: "B", key: "B" },
      { name: "C", key: "C" },
      { name: "D", key: "D" },
    ];

    setContainerWidth = async (width: number) => {
      this.containerWidth = width;
      await new Promise((resolve) => requestAnimationFrame(resolve));
    };

    table = headlessTable(this, {
      columns: () => this.columns,
      data: () => [] as unknown[],
      plugins: [ColumnResizing],
    });
  }

  class TestComponentA extends Component<{ ctx: Context }> {
    get table() {
      return this.args.ctx.table;
    }

    get modifiers() {
      return this.table.modifiers;
    }

    get testContainerStyle() {
      return htmlSafe(`width: ${this.args.ctx.containerWidth}px`);
    }

    <template>
      <TestStyles />
      <div data-container style={{this.testContainerStyle}}>
        <div data-scroll-container {{this.modifiers.container}}>
          <table>
            <thead>
              <tr>
                {{#each this.table.columns as |column|}}
                  <th {{this.modifiers.columnHeader column}}>
                    <span>{{column.name}}</span>

                    {{#if (hasResizeHandle column)}}
                      <div data-handle {{resizeHandle column}}>|</div>
                    {{/if}}
                  </th>
                {{/each}}
              </tr>
            </thead>
          </table>
        </div>
      </div>
    </template>
  }

  class TestComponentB extends Component<{ ctx: Context }> {
    resizeHandle = resizeHandle;

    get table() {
      return this.args.ctx.table;
    }

    get modifiers() {
      return this.table.modifiers;
    }

    get testContainerStyle() {
      return htmlSafe(`width: ${this.args.ctx.containerWidth}px`);
    }

    <template>
      <TestStyles />
      <div data-container style={{this.testContainerStyle}}>
        <div data-scroll-container {{this.modifiers.container}}>
          <table>
            <thead>
              <tr>
                {{#each this.table.columns as |column|}}
                  <th {{this.modifiers.columnHeader column}}>
                    <span>{{column.name}}</span>

                    <div data-handle {{this.resizeHandle column}}>|</div>
                  </th>
                {{/each}}
              </tr>
            </thead>
          </table>
        </div>
      </div>
    </template>
  }

  module("with no options specified", function (hooks) {
    class DefaultOptions extends Context {
      table = headlessTable(this, {
        columns: () => this.columns,
        data: () => [] as unknown[],
        plugins: [ColumnResizing, ColumnReordering, ColumnVisibility],
      });
    }

    hooks.beforeEach(function () {
      ctx = new DefaultOptions();
      setOwner(ctx, this.owner);
    });

    test("it resizes each column", async function () {
      ctx.setContainerWidth(1000);
      await render(<template><TestComponentA @ctx={{ctx}} /></template>);

      const [columnA, columnB, columnC, columnD] = getColumns();

      assert(`columnA doesn't exist`, columnA);
      assert(`columnB doesn't exist`, columnB);
      assert(`columnC doesn't exist`, columnC);
      assert(`columnD doesn't exist`, columnD);

      await requestAnimationFrameSettled();

      await assertChanges(
        () => dragRight(columnB, 50),
        [
          {
            value: () => width(columnA),
            by: 50,
            msg: "width of A increased by 50",
          },
          {
            value: () => width(columnB),
            by: -50,
            msg: "width of B decreased by 50",
          },
          { value: () => width(columnC), by: 0, msg: "width of C unchanged" },
          { value: () => width(columnD), by: 0, msg: "width of D unchanged" },
        ],
      );

      await assertChanges(
        () => dragLeft(columnB, 10),
        [
          {
            value: () => width(columnA),
            by: -10,
            msg: "width of A decreased by 10-",
          },
          {
            value: () => width(columnB),
            by: 10,
            msg: "width of B increased by 10",
          },
          { value: () => width(columnC), by: 0, msg: "width of C unchanged" },
          { value: () => width(columnD), by: 0, msg: "width of D unchanged" },
        ],
      );
    });
  });

  module("with a preferences adapter", function (hooks) {
    let preferences: null | PreferencesData = {};

    class DefaultOptions extends Context {
      table = headlessTable(this, {
        columns: () => this.columns,
        data: () => [] as unknown[],
        plugins: [ColumnResizing],
        preferences: {
          key: "test-preferences",
          adapter: {
            persist: (_key: string, data: PreferencesData) => {
              preferences = data;
            },
            restore: (key: string) => {
              return {
                plugins: {
                  ColumnResizing: {
                    columns: {
                      A: {
                        width: 300,
                      },
                      B: {
                        width: 250,
                      },
                      C: {
                        width: 250,
                      },
                      D: {
                        width: 200,
                      },
                    },
                    table: {},
                  },
                },
              };
            },
          },
        },
      });
    }

    hooks.beforeEach(function () {
      preferences = null;
      ctx = new DefaultOptions();
      setOwner(ctx, this.owner);
    });

    test("it restores column widths from preferences", async function (assert) {
      await render(<template><TestComponentA @ctx={{ctx}} /></template>);

      const [columnA, columnB, columnC, columnD] = getColumns();

      debugAssert(`columnA doesn't exist`, columnA);
      debugAssert(`columnB doesn't exist`, columnB);
      debugAssert(`columnC doesn't exist`, columnC);
      debugAssert(`columnD doesn't exist`, columnD);

      assert.equal(width(columnA), 300, "col A has expected width");
      assert.equal(width(columnB), 250, "col B has expected width");
      assert.equal(width(columnC), 250, "col C has expected width");
      assert.equal(width(columnD), 200, "col D has expected width");
    });

    test("resetting clears preferences, and restores the original column width", async function (assert) {
      await render(<template><TestComponentA @ctx={{ctx}} /></template>);
      const [columnA, columnB, columnC, columnD] = getColumns();

      debugAssert(`columnA doesn't exist`, columnA);
      debugAssert(`columnB doesn't exist`, columnB);
      debugAssert(`columnC doesn't exist`, columnC);
      debugAssert(`columnD doesn't exist`, columnD);

      assert.equal(width(columnA), 300, "col A has expected initial width");
      assert.equal(width(columnB), 250, "col B has expected initial width");
      assert.equal(width(columnC), 250, "col C has expected initial width");
      assert.equal(width(columnD), 200, "col D has expected initial width");

      ctx.table.resetToDefaults();
      await requestAnimationFrameSettled();

      // Columns are set to equal widths, so column will be 250px wide by default
      assert.equal(width(columnA), 250, "col A has expected width after reset");
      assert.equal(width(columnB), 250, "col B has expected width after reset");
      assert.equal(width(columnC), 250, "col C has expected width after reset");
      assert.equal(width(columnD), 250, "col D has expected width after reset");
      assert.deepEqual(
        preferences,
        {
          plugins: {
            ColumnResizing: {
              columns: {
                A: {},
                B: {},
                C: {},
                D: {},
              },
              table: {},
            },
          },
        },
        "All column preferences reset",
      );
    });

    test("it resizes each column and persists the new widths in the preferences", async function (assert) {
      ctx.setContainerWidth(1000);
      await render(<template><TestComponentA @ctx={{ctx}} /></template>);

      const [columnA, columnB, columnC, columnD] = getColumns();

      debugAssert(`columnA doesn't exist`, columnA);
      debugAssert(`columnB doesn't exist`, columnB);
      debugAssert(`columnC doesn't exist`, columnC);
      debugAssert(`columnD doesn't exist`, columnD);

      assert.equal(
        width(columnA),
        300,
        "col A has expected width before resize",
      );
      assert.equal(
        width(columnB),
        250,
        "col B has expected width before resize",
      );
      assert.equal(
        width(columnC),
        250,
        "col C has expected width before resize",
      );
      assert.equal(
        width(columnD),
        200,
        "col D has expected width before resize",
      );

      await requestAnimationFrameSettled();

      // move the the resize handler between columns A & B 200px to the right
      // increasing the width of column A and decreasing the width of columns
      // to the right , while respecting the min width (128px)
      await dragRight(columnB, 200);

      assert.equal(
        width(columnA),
        500,
        "col A has expected width after resize",
      );
      assert.equal(
        width(columnB),
        128,
        "col B has expected width after resize",
      );
      assert.equal(
        width(columnC),
        172,
        "col C has expected width after resize",
      );
      assert.equal(
        width(columnD),
        200,
        "col D has expected width after resize",
      );

      assert.strictEqual(
        Object.keys(preferences?.plugins ?? {})[0],
        "ColumnResizing",
      );

      let columns = preferences?.plugins?.ColumnResizing?.columns;
      assert.equal(columns?.A?.width, 500, "Column A");
      assert.equal(columns?.B?.width, 128, "Column B");
      assert.equal(columns?.C?.width, 172, "Column C");
      assert.equal(columns?.D?.width, 200, "Column D");
    });
  });

  module("with options that affect resize behavior", function (hooks) {
    module("handlePosition (default)", function (hooks) {
      class DefaultOptions extends Context {
        table = headlessTable(this, {
          columns: () => this.columns,
          data: () => [] as unknown[],
          plugins: [ColumnResizing],
        });
      }

      hooks.beforeEach(function () {
        ctx = new DefaultOptions();
        setOwner(ctx, this.owner);
      });

      test("it works", async function () {
        ctx.setContainerWidth(1000);
        await render(<template><TestComponentA @ctx={{ctx}} /></template>);

        const [columnA, columnB, columnC, columnD] = getColumns();

        assert(`columnA doesn't exist`, columnA);
        assert(`columnB doesn't exist`, columnB);
        assert(`columnC doesn't exist`, columnC);
        assert(`columnD doesn't exist`, columnD);

        await requestAnimationFrameSettled();

        await assertChanges(
          () => dragRight(columnB, 50),
          [
            {
              value: () => width(columnA),
              by: 50,
              msg: "width of A increased by 50",
            },
            {
              value: () => width(columnB),
              by: -50,
              msg: "width of B decreased by 50",
            },
            { value: () => width(columnC), by: 0, msg: "width of C unchanged" },
            { value: () => width(columnD), by: 0, msg: "width of D unchanged" },
          ],
        );

        await requestAnimationFrameSettled();

        await assertChanges(
          () => dragLeft(columnB, 10),
          [
            {
              value: () => width(columnA),
              by: -10,
              msg: "width of A decreased by 10-",
            },
            {
              value: () => width(columnB),
              by: 10,
              msg: "width of B increased by 10",
            },
            { value: () => width(columnC), by: 0, msg: "width of C unchanged" },
            { value: () => width(columnD), by: 0, msg: "width of D unchanged" },
          ],
        );
      });

      test("column resizing respects column minWidth", async function (qAssert) {
        let bColumn = ctx.columns[1];

        assert(`something went wrong, bColumn not found`, bColumn);

        bColumn.pluginOptions = [
          ColumnResizing.forColumn(() => ({ minWidth: 240 })),
        ];

        ctx.setContainerWidth(1000);
        await settled();
        await render(<template><TestComponentA @ctx={{ctx}} /></template>);

        const [columnA, columnB, columnC, columnD] = getColumns();

        assert(`columnA doesn't exist`, columnA);
        assert(`columnB doesn't exist`, columnB);
        assert(`columnC doesn't exist`, columnC);
        assert(`columnD doesn't exist`, columnD);

        await requestAnimationFrameSettled();

        // This will grow columnA by more than columnB can shrink, which should
        // cause columnB to shrink to it's minimum width and then shrink the next
        // column by the remainder.
        let room = roomToShrink(columnB);
        let delta = room + 50;

        qAssert.ok(room > 0, `roomToShrink for columnB is non-0 :: ${room}`);
        qAssert.ok(delta > 50, `delta to be used for test is > 50 :: ${delta}`);

        await assertChanges(
          () => dragRight(columnB, delta),
          [
            {
              value: () => width(columnA),
              by: delta,
              msg: `width of A increased by delta :: by ${delta}`,
            },
            {
              value: () => width(columnB),
              by: -room,
              msg: `width of B decreased to min width :: by ${room}`,
            },
            {
              value: () => width(columnC),
              by: -50,
              msg: `width of C decreased by remainder :: by -50`,
            },
            { value: () => width(columnD), by: 0, msg: "width of D unchanged" },
          ],
        );
      });

      test("table & columns resize to fit containing element", async function () {
        ctx.setContainerWidth(1000);
        await render(<template><TestComponentA @ctx={{ctx}} /></template>);

        const [columnA, columnB, columnC, columnD] = getColumns();

        assert(`columnA doesn't exist`, columnA);
        assert(`columnB doesn't exist`, columnB);
        assert(`columnC doesn't exist`, columnC);
        assert(`columnD doesn't exist`, columnD);

        await requestAnimationFrameSettled();

        // When the container grows, columns grow equally
        await assertChanges(async () => {
          ctx.setContainerWidth(ctx.containerWidth + 4000);
          await requestAnimationFrameSettled();
        }, [
          {
            value: () => width(columnA),
            by: 1000,
            msg: "width of A increased by 1000",
          },
          {
            value: () => width(columnB),
            by: 1000,
            msg: "width of B increased by 1000",
          },
          {
            value: () => width(columnC),
            by: 1000,
            msg: "width of C increased by 1000",
          },
          {
            value: () => width(columnD),
            by: 1000,
            msg: "width of D increased by 1000",
          },
        ]);

        // When the container shrinks, columns shrink equally
        await assertChanges(
          () => ctx.setContainerWidth(ctx.containerWidth - 2000),
          [
            {
              value: () => width(columnA),
              by: -500,
              msg: "width of A decreased by 500",
            },
            {
              value: () => width(columnB),
              by: -500,
              msg: "width of B decreased by 500",
            },
            {
              value: () => width(columnC),
              by: -500,
              msg: "width of C decreased by 500",
            },
            {
              value: () => width(columnD),
              by: -500,
              msg: "width of D decreased by 500",
            },
          ],
        );
      });

      test("table resizing respects resized columns", async function () {
        ctx.setContainerWidth(1000);
        await render(<template><TestComponentA @ctx={{ctx}} /></template>);

        const [columnA, columnB, columnC, columnD] = getColumns();

        assert(`columnA doesn't exist`, columnA);
        assert(`columnB doesn't exist`, columnB);
        assert(`columnC doesn't exist`, columnC);
        assert(`columnD doesn't exist`, columnD);

        await requestAnimationFrameSettled();

        // Resize a column
        await assertChanges(
          () => dragRight(columnB, 50),
          [
            {
              value: () => width(columnA),
              by: 50,
              msg: "width of A increased by 50",
            },
            {
              value: () => width(columnB),
              by: -50,
              msg: "width of B decreased by 50",
            },
            { value: () => width(columnC), by: 0, msg: "width of C unchanged" },
            { value: () => width(columnD), by: 0, msg: "width of D unchanged" },
          ],
        );

        // When the container grows by 1000, each column grows by 250
        await assertChanges(
          () => ctx.setContainerWidth(ctx.containerWidth + 1000),
          [
            {
              value: () => width(columnA),
              by: 250,
              msg: "width of A increased by 250",
            },
            {
              value: () => width(columnB),
              by: 250,
              msg: "width of B increased by 250",
            },
            {
              value: () => width(columnC),
              by: 250,
              msg: "width of C increased by 250",
            },
            {
              value: () => width(columnD),
              by: 250,
              msg: "width of D increased by 250",
            },
          ],
        );

        // When the container shrinks by 1000, each column shrinks by 250
        await assertChanges(
          () => ctx.setContainerWidth(ctx.containerWidth - 1000),
          [
            {
              value: () => width(columnA),
              by: -250,
              msg: "width of A decreased by 250",
            },
            {
              value: () => width(columnB),
              by: -250,
              msg: "width of B decreased by 250",
            },
            {
              value: () => width(columnC),
              by: -250,
              msg: "width of C decreased by 250",
            },
            {
              value: () => width(columnD),
              by: -250,
              msg: "width of D decreased by 250",
            },
          ],
        );
      });
    });

    module("handlePosition: right", function (hooks) {
      class HandlePositionRight extends Context {
        table = headlessTable(this, {
          columns: () => this.columns,
          data: () => [] as unknown[],
          plugins: [
            ColumnVisibility,
            ColumnResizing.with(() => ({ handlePosition: "right" })),
          ],
        });
      }

      hooks.beforeEach(function () {
        ctx = new HandlePositionRight();
        setOwner(ctx, this.owner);
      });

      skip("it works", async function () {
        ctx.setContainerWidth(1000);
        await render(<template><TestComponentB @ctx={{ctx}} /></template>);

        const [columnA, columnB, columnC, columnD] = getColumns();

        assert(`columnA doesn't exist`, columnA);
        assert(`columnB doesn't exist`, columnB);
        assert(`columnC doesn't exist`, columnC);
        assert(`columnD doesn't exist`, columnD);

        await requestAnimationFrameSettled();

        await assertChanges(
          () => dragRight(columnB, 50),
          [
            {
              value: () => width(columnA),
              by: 50,
              msg: "width of A increased by 50",
            },
            {
              value: () => width(columnB),
              by: -50,
              msg: "width of B decreased by 50",
            },
            { value: () => width(columnC), by: 0, msg: "width of C unchanged" },
            { value: () => width(columnD), by: 0, msg: "width of D unchanged" },
          ],
        );

        await assertChanges(
          () => dragLeft(columnB, 10),
          [
            {
              value: () => width(columnA),
              by: -10,
              msg: "width of A decreased by 10-",
            },
            {
              value: () => width(columnB),
              by: 10,
              msg: "width of B increased by 10",
            },
            { value: () => width(columnC), by: 0, msg: "width of C unchanged" },
            { value: () => width(columnD), by: 0, msg: "width of D unchanged" },
          ],
        );
      });
    });
  });

  module("interaction with other plugins", function () {
    module("ColumnReordering", function (hooks) {
      class DefaultOptions extends Context {
        table = headlessTable(this, {
          columns: () => this.columns,
          data: () => [] as unknown[],
          plugins: [ColumnResizing, ColumnReordering, ColumnVisibility],
        });
      }

      hooks.beforeEach(function () {
        ctx = new DefaultOptions();
        setOwner(ctx, this.owner);
      });

      test("resizing makes sense regardless of column order", async function (assert) {
        ctx.setContainerWidth(1000);
        await render(
          <template>
            {{#each ctx.table.columns as |column|}}
              <button
                id="{{column.key}}-left"
                type="button"
                {{on "click" (fn moveLeft column)}}
              >move {{column.key}} left</button>
              <button
                id="{{column.key}}-right"
                type="button"
                {{on "click" (fn moveRight column)}}
              >move {{column.key}} right</button>
              <br />
            {{/each}}

            <TestComponentA @ctx={{ctx}} />
          </template>,
        );

        const [columnA, columnB, columnC, columnD] = getColumns();

        debugAssert(`columnA doesn't exist`, columnA);
        debugAssert(`columnB doesn't exist`, columnB);
        debugAssert(`columnC doesn't exist`, columnC);
        debugAssert(`columnD doesn't exist`, columnD);

        await requestAnimationFrameSettled();

        const assertSizes = (sizes: Array<[HTMLTableCellElement, number]>) => {
          for (let pair of sizes) {
            let actual = width(pair[0]);

            assert.strictEqual(actual, pair[1]);
          }
        };

        assertSizes([
          [columnA, 250],
          [columnB, 250],
          [columnC, 250],
          [columnD, 250],
        ]);

        await assertChanges(
          () => dragRight(columnB, 50),
          [
            {
              value: () => width(columnA),
              by: 50,
              msg: "width of A increased by 50",
            },
            {
              value: () => width(columnB),
              by: -50,
              msg: "width of B decreased by 50",
            },
            { value: () => width(columnC), by: 0, msg: "width of C unchanged" },
            { value: () => width(columnD), by: 0, msg: "width of D unchanged" },
          ],
        );

        assertSizes([
          [columnA, 300],
          [columnB, 200],
          [columnC, 250],
          [columnD, 250],
        ]);

        await click("#B-right");
        await requestAnimationFrameSettled();

        // Sizes don't change
        assertSizes([
          [columnA, 300],
          [columnB, 200],
          [columnC, 250],
          [columnD, 250],
        ]);

        await assertChanges(
          () => dragLeft(columnB, 10),
          [
            { value: () => width(columnA), by: 0, msg: "width of A unchanged" },
            {
              value: () => width(columnC),
              by: -10,
              msg: "width of C decreased by 10",
            },
            {
              value: () => width(columnB),
              by: 10,
              msg: "width of B increased by 10",
            },
            { value: () => width(columnD), by: 0, msg: "width of D unchanged" },
          ],
        );
      });
    });
  });
});
