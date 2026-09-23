import { cached } from '@glimmer/tracking';

import { BasePlugin, meta, options, preferences } from '../-private/base.ts';

import type { Plugin, PluginPreferences } from '../../plugins/index.ts';
import type { Column, Table } from '../../index.ts';

interface ColumnVisibilityPreferences extends PluginPreferences {
  columns: {
    [columnKey: string]: {
      isVisible?: boolean;
    };
  };
}

declare module '@universal-ember/table/plugins' {
  interface Registry {
    ColumnVisibility?: ColumnVisibilityPreferences;
    'column-visibility'?: ColumnVisibilityPreferences;
  }
}

export interface Signature {
  Meta: {
    Table: TableMeta;
    Column: ColumnMeta;
  };
  Options: {
    Plugin: {
      enabled?: boolean;
    };
    Column: {
      /**
       * The default visibilty of the column, when rendered.
       * The column can still be toggled on and off.
       *
       * When interacting with preferences, the value stored in preferenced
       * will be the inverse of this value (to save space in storage).
       */
      isVisible?: boolean;
    };
  };
}

export class ColumnVisibility
  extends BasePlugin<Signature>
  implements Plugin<Signature>
{
  name = 'column-visibility';
  static features: string[] = ['columnVisibility'];

  meta: {
    column: typeof ColumnMeta;
    table: typeof TableMeta;
  } = {
    column: ColumnMeta,
    table: TableMeta,
  };

  reset(): void {
    preferences.forAllColumns(this.table, ColumnVisibility).delete('isVisible');
  }

  get columns(): Column<unknown>[] {
    return meta.forTable(this.table, ColumnVisibility).visibleColumns;
  }
}

export class ColumnMeta<Data = unknown> {
  constructor(private column: Column<Data>) {}

  get isVisible(): boolean {
    const columnPreferences = preferences.forColumn(
      this.column,
      ColumnVisibility,
    );
    const columnOptions = options.forColumn(this.column, ColumnVisibility);

    return Boolean(
      columnPreferences.get('isVisible') ?? columnOptions?.isVisible ?? true,
    );
  }

  get isHidden(): boolean {
    return !this.isVisible;
  }

  hide = (): void => {
    if (!this.isVisible) return;

    const myPreferences = preferences.forColumn(this.column, ColumnVisibility);
    const myOptions = options.forColumn(this.column, ColumnVisibility);
    const currentSaved = myPreferences.get('isVisible');
    const willBeDefault = Boolean(currentSaved) === !myOptions?.isVisible;

    if (willBeDefault) {
      myPreferences.set('isVisible', false);
      // TODO: open an issue about tracked-built-ins' delete not being reactive
      // myPreferences.delete('isVisible');

      return;
    }

    myPreferences.set('isVisible', false);
  };

  show = (): void => {
    if (this.isVisible) return;

    const myPreferences = preferences.forColumn(this.column, ColumnVisibility);
    const myOptions = options.forColumn(this.column, ColumnVisibility);
    const currentSaved = myPreferences.get('isVisible');
    const willBeDefault = currentSaved === !myOptions?.isVisible;

    if (willBeDefault) {
      myPreferences.set('isVisible', true);
      // TODO: open an issue about tracked-built-ins' delete not being reactive
      // myPreferences.delete('isVisible');

      return;
    }

    myPreferences.set('isVisible', true);
  };

  toggle = (): void => {
    if (this.isVisible) {
      this.hide();

      return;
    }

    this.show();
  };
}

export class TableMeta<Data = unknown> {
  constructor(private table: Table<Data>) {}

  @cached
  get visibleColumns(): Column<Data>[] {
    const allColumns = this.table.columns.values();

    return allColumns.filter((column) => {
      const columnMeta = meta.forColumn(column, ColumnVisibility);

      return columnMeta.isVisible;
    });
  }

  toggleColumnVisibility = (column: Column<Data>): void => {
    const columnMeta = meta.forColumn(column, ColumnVisibility);

    columnMeta.toggle();
  };
}
