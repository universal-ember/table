import { BasePlugin, meta, options, preferences } from '../../plugins/index.ts';
import { expectTypeOf } from 'expect-type';

import type { Column, Table } from '../../index.ts';

// This value is irrelevant for the tests it's used in
const x = 0 as unknown as Table<unknown>;
const y = 0 as unknown as Column<unknown>;

//////////////////////////////////////////////
// A SimplePlugin
//////////////////////////////////////////////
class ATableMeta {
  isEnabled = true;
}
class AColumnMeta {
  isPinned = 1;
}
class ARowMeta {
  isARow = true;
}
interface AOptions {
  enabled?: boolean;
}
interface AColumnOptions {
  isPinned?: boolean;
}

interface SignatureA {
  Meta: {
    Table: ATableMeta;
    Column: AColumnMeta;
    Row: ARowMeta;
  };
  Options: {
    Plugin: AOptions;
    Column: AColumnOptions;
  };
}

class SimplePlugin<Signature = SignatureA> extends BasePlugin<Signature> {
  name = 'my-test-plugin';
}

// Options
expectTypeOf(options.forTable(x, SimplePlugin)).toEqualTypeOf<AOptions>();
expectTypeOf(
  options.forColumn(y, SimplePlugin),
).toEqualTypeOf<AColumnOptions>();

// Meta
expectTypeOf(meta.forTable(x, SimplePlugin)).toEqualTypeOf<ATableMeta>();
expectTypeOf(meta.forColumn(y, SimplePlugin)).toEqualTypeOf<AColumnMeta>();

// Preferences
interface MapLite {
  get(key: string): unknown;
  set(key: string, value: unknown): void | undefined;
  delete(key: string): void | undefined;
}
expectTypeOf(preferences.forTable(x, SimplePlugin)).toEqualTypeOf<MapLite>();
expectTypeOf(preferences.forColumn(y, SimplePlugin)).toEqualTypeOf<MapLite>();

//////////////////////////////////////////////
// A Real plugin
//////////////////////////////////////////////

import { DataSorting } from '../../plugins/data-sorting/index.ts';

import type { Signature as DataSortingSignature } from '../../plugins/data-sorting/index.ts';

// Options
expectTypeOf(options.forTable(x, DataSorting)).toEqualTypeOf<
  DataSortingSignature['Options']['Plugin']
>();
expectTypeOf(options.forColumn(y, DataSorting)).toEqualTypeOf<
  DataSortingSignature['Options']['Column']
>();

// Meta
expectTypeOf(meta.forTable(x, DataSorting)).toEqualTypeOf<
  DataSortingSignature['Meta']['Table']
>();
expectTypeOf(meta.forColumn(y, DataSorting)).toEqualTypeOf<
  DataSortingSignature['Meta']['Column']
>();
