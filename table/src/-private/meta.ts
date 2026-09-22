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
