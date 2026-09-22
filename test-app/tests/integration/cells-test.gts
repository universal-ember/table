import { setOwner } from "@ember/owner";
import { render } from "@ember/test-helpers";
import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";

import { headlessTable } from "@universal-ember/table";

import type { TOC } from "@ember/component/template-only";
import type { CellContext } from "@universal-ember/table";

interface Person {
  name: string;
  age: number;
}

const people: Person[] = [
  { name: "Ada", age: 36 },
  { name: "Grace", age: 45 },
];

const GroupedCell: TOC<{
  Args: CellContext<Person> & { groupBy: "day" | "week" };
}> = <template>
  <span class="grouped">{{@row.data.name}} by {{@groupBy}}</span>
</template>;

const AgeCell: TOC<{ Args: CellContext<Person> }> = <template>
  <span class="age">{{@row.data.age}}</span>
</template>;

const UnitCell: TOC<{
  Args: CellContext<Person> & { options: { unit: string } };
}> = <template>
  <span class="unit">{{@row.data.age}} {{@options.unit}}</span>
</template>;

class OptionsContext {
  table = headlessTable(this, {
    columns: () => [
      { key: "age", Cell: UnitCell, options: () => ({ unit: "years" }) },
    ],
    data: () => people,
  });
}

class Context {
  table = headlessTable(this, {
    columns: () => [
      { key: "name", Cell: GroupedCell },
      { key: "age", Cell: AgeCell },
      {
        key: "inline",
        Cell: <template>
          <span class="inline">inline</span>
        </template>,
      },
    ],
    data: () => people,
  });
}

module("Cells", function (hooks) {
  setupRenderingTest(hooks);

  test("each Cell is rendered with the args of the table", async function (assert) {
    const ctx = new Context();

    setOwner(ctx, this.owner);

    const table = ctx.table;

    await render(
      <template>
        {{#each table.rows as |row|}}
          {{#each table.columns as |column|}}
            {{#if column.Cell}}
              <column.Cell @row={{row}} @column={{column}} @groupBy="week" />
            {{/if}}
          {{/each}}
        {{/each}}
      </template>,
    );

    assert.dom(".grouped").exists({ count: 2 });
    assert.dom(".grouped").hasText("Ada by week");
    assert.dom(".age").exists({ count: 2 });
    assert.dom(".inline").exists({ count: 2 });
  });

  test("a Cell gets the options of its column", async function (assert) {
    const ctx = new OptionsContext();

    setOwner(ctx, this.owner);

    const table = ctx.table;

    await render(
      <template>
        {{#each table.rows as |row|}}
          {{#each table.columns as |column|}}
            {{#if column.Cell}}
              <column.Cell
                @row={{row}}
                @column={{column}}
                @options={{column.getOptionsForRow row}}
              />
            {{/if}}
          {{/each}}
        {{/each}}
      </template>,
    );

    assert.dom(".unit").exists({ count: 2 });
    assert.dom(".unit").hasText("36 years");
  });
});

/**
 * Never rendered: these templates only exist for the type checks.
 */
const TypeChecks: TOC<{ Args: { table: Context["table"] } }> = <template>
  {{#each @table.rows as |row|}}
    {{#each @table.columns as |column|}}
      {{#if column.Cell}}
        {{! @glint-expect-error the table's Cells need @groupBy }}
        <column.Cell @row={{row}} @column={{column}} />

        {{! @glint-expect-error not one of the groupings }}
        <column.Cell @row={{row}} @column={{column}} @groupBy="year" />
      {{/if}}
    {{/each}}
  {{/each}}
</template>;

void TypeChecks;
