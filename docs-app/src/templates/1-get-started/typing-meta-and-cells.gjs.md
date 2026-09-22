---
title: Typing meta and cells
---

# Typing meta and cells

`headlessTable` infers the types of a table from its config.
Most tables need no type annotations.
This page shows what is inferred, how to check it, and how to replace it with a type you declare.

| What                | Where you read it      | Inferred from                     |
| ------------------- | ---------------------- | --------------------------------- |
| Row data            | `row.data`             | `data`                            |
| Column meta         | `column.meta`          | the `meta` of each column         |
| Table meta          | `table.config.meta`    | the `meta` of the config          |
| Extra args of cells | `<column.Cell @... />` | the args of each `Cell` component |

## Column meta

A column's `meta` holds information that is not tied to a row, for example the alignment of the column.

```ts
class Report {
  table = headlessTable(this, {
    columns: () => [
      { key: "name", meta: { align: "left" } },
      { key: "age", meta: { align: "right", exportWidth: 12 } },
      { key: "email" },
    ],
    data: () => this.people,
  });
}
```

The metas of all columns merge into one type:

```ts
table.columns[0].meta;
// { align?: 'left' | 'right'; exportWidth?: 12 } | undefined
```

Values keep their literal types: `'left'`, not `string`, and `12`, not `number`.
If no column has a `meta`, `column.meta` is `unknown`, and reading a key from it is a type error.

### Check each column against a shape

Use `satisfies` to check one column in place.
The inferred type stays as it is.

```ts
interface Alignment {
  align?: "left" | "right";
}

columns: () => [{ key: "name", meta: { align: "left" } satisfies Alignment }],
```

### Declare the type yourself

Give the column list a type.
The table then uses that type, and every column is checked against it.

```ts
import type { ColumnConfig } from "@universal-ember/table";

class Report {
  columns: ColumnConfig<Person, Alignment>[] = [
    { key: "name", meta: { align: "left" } },
    { key: "age", meta: { align: "right" } },
  ];

  table = headlessTable(this, {
    columns: () => this.columns,
    data: () => this.people,
  });
}

// table.columns[0].meta: Alignment | undefined
```

## Table meta

The config's `meta` is for information about the whole table.
Its type is inferred, and the keys that the library itself uses (`TableMeta`) stay available.

```ts
table = headlessTable(this, {
  columns: () => [
    /* ... */
  ],
  data: () => this.people,
  meta: {
    currency: "EUR",
    updateCell: (person: Person, key: string, value: unknown) => {
      /* ... */
    },
  },
});

table.config.meta?.currency; // string | undefined
table.config.meta?.totalRowCount; // number | undefined, from TableMeta
```

A function in `meta` needs types on its parameters, because TypeScript cannot infer them there.

The table meta is also available in `value`, `options`, and `Cell`, through `column.table.config.meta`.

## Extra args of cells

A `Cell` component always gets `@row` and `@column`.
It can take more args, which you pass where you render it:

```gts
import type { TOC } from "@ember/component/template-only";
import type { CellContext } from "@universal-ember/table";

const GroupedCell: TOC<{
  Args: CellContext<Person> & { groupBy: "day" | "week" };
}> = <template>{{@row.data.name}} by {{@groupBy}}</template>;

class Report {
  table = headlessTable(this, {
    columns: () => [
      { key: "name", Cell: GroupedCell },
      { key: "age", Cell: AgeCell },
    ],
    data: () => this.people,
  });
}
```

```gts
{{#each table.rows as |row|}}
  {{#each table.columns as |column|}}
    {{#if column.Cell}}
      <column.Cell @row={{row}} @column={{column}} @groupBy={{this.groupBy}} />
    {{/if}}
  {{/each}}
{{/each}}
```

The table collects the extra args of all its Cells.
Glint then reports a missing `@groupBy`, or a value that is not `"day"` or `"week"`.
If two Cells take different args, the table needs both of them.

### Declare the args yourself

Give the column list a type with the args as the fourth type argument.
Use this when the Cells come from elsewhere, or when you want one place that names all args.

```ts
interface ReportCellArgs {
  groupBy: "day" | "week";
  onUpdate: (value: string) => void;
}

columns: ColumnConfig<Person, unknown, unknown, ReportCellArgs>[] = [
  { key: "name", Cell: GroupedCell },
  { key: "age", Cell: UpdateCell },
];
```

The type arguments of `ColumnConfig` are, in order:

1. the row data
2. the column meta
3. the table meta
4. the extra args of cells

Use `unknown` for the ones that you do not declare.

## Writing a Cell component

`CellContext` has the same order: row data, column meta, table meta.
Ask for the parts that the Cell reads.

```gts
const AlignedCell: TOC<{
  Args: CellContext<Person, Alignment, { currency: string }>;
}> = <template>
  <span class={{@column.meta.align}}>
    {{@row.data.age}}
    {{@column.table.config.meta.currency}}
  </span>
</template>;
```

TypeScript reports a column whose meta does not match `Alignment`, and a table whose meta has no `currency`.

## Code that takes any table

A function that accepts `Column<Person>` or `Table<Person>` accepts columns and tables with any meta.

A column whose Cell takes extra args needs `any` as the fourth type argument,
because its Cell cannot be rendered with `@row` and `@column` only:

```ts
function keysOf(columns: Column<Person, unknown, unknown, any>[]) {
  return columns.map((column) => column.key);
}
```

To read a meta, ask for it:

```ts
function exportWidthOf(column: Column<Person, { exportWidth?: number }>) {
  return column.meta?.exportWidth;
}
```

## Limits

- In `value` and `options`, `column.meta` is `unknown`, because TypeScript cannot give it the inferred type there.
  Use the value from the column config itself.
- An inline `<template>` Cell has no types for its args.
  To use `@row` or other args in it, move it into a constant with a `TOC` type, as in the examples above.
- A function inside a `meta` needs types on its parameters.
