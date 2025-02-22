import { cached } from '@glimmer/tracking';
import { action } from '@ember/object';

import { BasePlugin, meta, options, preferences } from '../-private/base.ts';

import type { Plugin, PluginPreferences } from '[public-plugin-types]';
import type { Column, Table } from '[public-types]';

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

export class ColumnVisibility extends BasePlugin<Signature> implements Plugin<Signature> {
  name = 'column-visibility';
  static features = ['columnVisibility'];

  meta = {
    column: ColumnMeta,
    table: TableMeta,
  };

  reset() {
    preferences.forAllColumns(this.table, ColumnVisibility).delete('isVisible');
  }

  get columns() {
    return meta.forTable(this.table, ColumnVisibility).visibleColumns;
  }
}

export class ColumnMeta<Data = unknown> {
  constructor(private column: Column<Data>) {}

  get isVisible(): boolean {
    const columnPreferences = preferences.forColumn(this.column, ColumnVisibility);
    const columnOptions = options.forColumn(this.column, ColumnVisibility);

    return Boolean(columnPreferences.get('isVisible') ?? columnOptions?.isVisible ?? true);
  }

  get isHidden(): boolean {
    return !this.isVisible;
  }

  hide = () => {
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

  show = () => {
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

  toggle = () => {
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

  @action
  toggleColumnVisibility(column: Column<Data>) {
    const columnMeta = meta.forColumn(column, ColumnVisibility);

    columnMeta.toggle();
  }
}
