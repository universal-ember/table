import type { TemplateOnlyComponent } from '@ember/component/template-only';
import type {
  Invoke,
  UnwrapNamedArgs,
} from '@glint/template/-private/integration';
import type { ComponentSignatureArgs } from '@glint/template/-private/signature';

/**
 * The metas of columns that set one.
 * A column without `meta` infers `unknown`, and would swallow the union.
 */
type ProvidedMetas<Metas extends unknown[]> = {
  [K in keyof Metas]: unknown extends Metas[K] ? never : Metas[K];
}[number];

type KeysOf<U> = U extends unknown ? keyof U : never;

type ValueAt<U, K extends PropertyKey> = U extends unknown
  ? K extends keyof U
    ? U[K]
    : never
  : never;

/**
 * The type of `column.meta`, from the `meta` of each column in a config.
 *
 * A list written in place is a tuple, and its metas merge into one object:
 *
 *   [{ meta: { align: 'left' } }, { meta: { align: 'right', width: 2 } }]
 *   → { align?: 'left' | 'right'; width?: 2 }
 *
 * A list with a declared type keeps that type:
 *
 *   ColumnConfig<Person, ReportMeta>[] → ReportMeta
 */
export type ColumnMetaOf<Metas extends unknown[]> =
  number extends Metas['length']
    ? Metas[number]
    : [ProvidedMetas<Metas>] extends [never]
      ? unknown
      : {
          -readonly [K in KeysOf<ProvidedMetas<Metas>>]?: ValueAt<
            ProvidedMetas<Metas>,
            K
          >;
        };

/**
 * The Cells of columns that set one.
 */
type ProvidedCells<Columns extends readonly unknown[]> =
  Columns[number] extends infer Column
    ? Column extends { Cell?: infer Cell }
      ? NonNullable<Cell>
      : never
    : never;

/**
 * The named args of a component:
 *
 * - a template-only component: from its signature
 * - a class component: from the `[Invoke]` Glint gives it, else from `args`
 * - a `ComponentLike`: from `[Invoke]`
 */
type NamedArgsOf<Cell> =
  Cell extends TemplateOnlyComponent<infer Signature>
    ? ComponentSignatureArgs<Signature>['Named']
    : Cell extends abstract new (...args: any) => infer Instance
      ? Instance extends { [Invoke]: (...args: infer Params) => any }
        ? Params extends [...unknown[], infer Named]
          ? UnwrapNamedArgs<Named>
          : Params extends [(infer Named)?]
            ? UnwrapNamedArgs<NonNullable<Named>>
            : never
        : Instance extends { args: infer Args }
          ? Args
          : never
      : never;

type ExtraArgsOf<Cell> = Cell extends unknown
  ? Omit<NamedArgsOf<Cell>, 'row' | 'column'>
  : never;

type UnionToIntersection<U> = (
  U extends unknown ? (union: U) => void : never
) extends (intersection: infer I) => void
  ? I
  : never;

/**
 * The args of `column.Cell` besides `@row` and `@column`:
 * every arg that any Cell of the config takes.
 *
 *   [{ Cell: GroupByCell }, { Cell: UpdateCell }]
 *   → { groupBy: ... } & { onUpdate: ... }
 */
export type CellArgsOf<Columns extends readonly unknown[]> = [
  ProvidedCells<Columns>,
] extends [never]
  ? unknown
  : UnionToIntersection<ExtraArgsOf<ProvidedCells<Columns>>>;

/**
 * The `@options` the Cells of a table ask for, from their args.
 * Without such a Cell, nothing is added to the default value.
 */
export type CellOptionsOf<CellArgs> = CellArgs extends {
  options?: infer Options;
}
  ? Options
  : unknown;
