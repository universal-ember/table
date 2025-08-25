import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { htmlSafe } from "@ember/template";
import { render } from "@ember/test-helpers";
import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { setOwner } from "@ember/owner";

import { headlessTable, type ColumnConfig } from "@universal-ember/table";
import {
  ColumnResizing,
  resizeHandle,
} from "@universal-ember/table/plugins/column-resizing";
import { createHelpers } from "@universal-ember/table/test-support";

import { TestStyles, getColumns, assertChanges, width } from "./utils.gts";

module("Plugins | resizing | fixed layout", function (hooks) {
  setupRenderingTest(hooks);

  let ctx: Context;
  let { dragLeft, dragRight } = createHelpers({
    resizeHandle: "[data-handle]",
  });

  hooks.beforeEach(function () {
    ctx = new Context();
    setOwner(ctx, this.owner);
  });

  class Context {
    @tracked containerWidth = 1000;

    columns: ColumnConfig[] = [
      { name: "A", key: "A", pluginOptions: [ColumnResizing.forColumn(() => ({ minWidth: 128 }))],},
      { name: "B", key: "B", pluginOptions: [ColumnResizing.forColumn(() => ({ minWidth: 128 }))] },
      { name: "C", key: "C", pluginOptions: [ColumnResizing.forColumn(() => ({ minWidth: 128 }))] },
      { name: "D", key: "D", pluginOptions: [ColumnResizing.forColumn(() => ({ minWidth: 128 }))] },
    ];

    table = headlessTable(this, {
      columns: () => this.columns,
      data: () => [] as unknown[],
      plugins: [ColumnResizing.with(() => ({ tableLayout: "fixed" }))],
    });
  }

  class FixedLayoutTestComponent extends Component<{ ctx: Context }> {
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
          <table style="table-layout: fixed;">
            <thead>
              <tr>
                {{#each this.table.columns as |column|}}
                  <th {{this.modifiers.columnHeader column}}>
                    <span>{{column.name}}</span>
                    <div
                      data-handle
                      {{resizeHandle column}}
                      type="button"
                    >|</div>
                  </th>
                {{/each}}
              </tr>
            </thead>
          </table>
        </div>
      </div>
    </template>
  }
});
