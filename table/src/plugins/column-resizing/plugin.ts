import { cached, tracked } from '@glimmer/tracking';
import { assert } from '@ember/debug';
import { isDestroyed, isDestroying } from '@ember/destroyable';
import { action } from '@ember/object';

import { preferences } from '../../plugins/index.ts';

import { BasePlugin, columns, meta, options } from '../-private/base.ts';
import { applyStyles } from '../-private/utils.ts';
import {
  getAccurateClientHeight,
  getAccurateClientWidth,
  totalGapOf,
} from './utils.ts';

import type { ColumnApi, PluginPreferences } from '../../plugins/index.ts';
import type { Column, Table } from '../../index.ts';

interface ColumnResizePreferences extends PluginPreferences {
  columns: {
    [columnKey: string]: {
      width?: number;
    };
  };
}

declare module '@universal-ember/table/plugins' {
  interface Registry {
    ColumnResizing?: ColumnResizePreferences;
  }
}

export interface ColumnOptions {
  /**
   * Force a starting width
   * This may not be less than the minWidth
   */
  width?: number;
  /**
   * Default: 128px
   */
  minWidth?: number;
  /**
   * Flip if the column is resizable or not.
   * The default is whatever the table's plugin option is set to
   * (and then yet again true, if not set at all)
   */
  isResizable?: boolean;
}

export interface TableOptions {
  /**
   * Toggle whether the table is able to be resized at all
   *
   * default :true
   */
  enabled?: boolean;

  /**
   * By default, each column's "handle" position is on the
   * left-hand side of the column.
   *
   * If, for style-reasons, you want to move it to the right,
   * this option should reflect that so that the calculations can be
   * updated to match the expected behavior of which column(s) grow/shrink
   *
   * Valid values are 'left' or 'right'
   */
  handlePosition?: string;

  /**
   * Specify the table layout strategy for column resizing.
   *
   * - 'auto': Uses complex redistribution logic where resizing one column
   *   affects neighboring columns (default, preserves existing behavior)
   * - 'fixed': Simple per-column resizing suitable for CSS table-layout: fixed
   *
   * Valid values are 'auto' or 'fixed'
   *
   * default: 'auto'
   */
  tableLayout?: string;
}

interface Signature {
  Meta: {
    Column: ColumnMeta;
    Table: TableMeta;
  };
  Options: {
    Plugin: TableOptions;
    Column: ColumnOptions;
  };
}

/**
 * One instance of a plugin exists per table
 * but a plugin can have a "Meta" for each column
 */
export class ColumnResizing extends BasePlugin<Signature> {
  name = 'column-resizing';
  static features = ['columnWidth'];

  meta = {
    column: ColumnMeta,
    table: TableMeta,
  };

  headerCellModifier = (element: HTMLElement, { column }: ColumnApi) => {
    const columnMeta = meta.forColumn(column, ColumnResizing);

    element.setAttribute('data-test-is-resizable', `${columnMeta.isResizable}`);

    applyStyles(element, columnMeta.style);
  };

  /**
   * This is what ends up calling resize when the browser changes
   * (assuming that the containing element's styles stretch to fill the space)
   *
   * Later, when container queries are more broadly supported, we'll want to watch
   * the container instead of the window to prevent unneeded updates (as a window can change
   * size without the container changing size)
   */
  containerModifier = resizeObserver;

  reset() {
    preferences.forAllColumns(this.table, ColumnResizing).delete('width');
  }
}

const DEFAULT_COLUMN_OPTIONS = {
  minWidth: 128,
};

const ALLOWED_COLUMN_OPTIONS = ['minWidth', 'width', 'isResizable'];

/**
 * @private
 *
 * Contains resizable information for a particular column
 */
export class ColumnMeta {
  constructor(private column: Column) {}

  @tracked _width?: number;
  @tracked isResizing = false;

  get tableMeta() {
    return meta.forTable(this.column.table, ColumnResizing);
  }

  @cached
  get options() {
    const columnOptions = options.forColumn(this.column, ColumnResizing);
    const filteredOptions = Object.entries(columnOptions || {}).reduce(
      (result, [k, v]) => {
        if (ALLOWED_COLUMN_OPTIONS.includes(k)) {
          result[k] = v;
        }

        return result;
      },
      {} as Record<string, unknown>,
    ) as ColumnOptions;

    return {
      ...DEFAULT_COLUMN_OPTIONS,
      ...filteredOptions,
    };
  }

  get key() {
    return this.column.key;
  }

  get minWidth() {
    return this.options.minWidth;
  }

  get initialWidth() {
    const savedWidth = preferences
      .forColumn(this.column, ColumnResizing)
      .get('width');

    if (!savedWidth) {
      return this.options.width;
    }

    if (typeof savedWidth !== 'string') {
      assert(
        'saved width must be a number or string',
        typeof savedWidth === 'number',
      );
      return savedWidth;
    }

    return parseInt(savedWidth, 10);
  }

  get canShrink() {
    return this.width && this.width > this.minWidth;
  }

  get roomToShrink() {
    return this.width ? this.width - this.minWidth : 0;
  }

  get isResizable() {
    return this.options.isResizable ?? this.tableMeta.isResizable;
  }

  get hasResizeHandle() {
    const previous = columns.previous(this.column);

    if (!previous) return false;

    return (
      this.isResizable && meta.forColumn(previous, ColumnResizing).isResizable
    );
  }

  get width() {
    let width = this._width ?? this.initialWidth;

    if (!width) {
      const { defaultColumnWidth } = this.tableMeta;

      width = defaultColumnWidth
        ? Math.max(defaultColumnWidth, this.minWidth)
        : this.minWidth;
    }

    return width;
  }

  set width(value) {
    this._width = value;
  }

  get style() {
    const styles: Partial<Pick<CSSStyleDeclaration, 'width' | 'minWidth'>> = {};

    if (this.width) styles.width = `${this.width}px`;
    if (this.minWidth) styles.minWidth = `${this.minWidth}px`;

    return styles;
  }

  @action
  resize(delta: number) {
    this.tableMeta.resizeColumn(this.column, delta);
  }

  @action
  save() {
    this.tableMeta.saveColWidths(this.tableMeta.visibleColumnMetas);
  }
}

/**
 * @private
 *
 * individual column width must exclude:
 * - padding
 *   - margin
 *   - gap (partial)
 *   - any other positioning offsets
 *
 *   Otherwise the table will infinitely resize itself
 */
function distributeDelta(delta: number, visibleColumns: Column[]) {
  if (delta === 0) return;

  const metas = visibleColumns.map((column) =>
    meta.forColumn(column, ColumnResizing),
  );

  const resizableMetas = metas.filter(
    (meta) => meta.isResizable && (delta < 0 ? meta.canShrink : true),
  );

  const columnDelta = delta / resizableMetas.length;

  for (const meta of resizableMetas) {
    assert('cannot resize a column that does not have a width', meta.width);
    meta.width = Math.max(meta.width + columnDelta, meta.minWidth);
  }
}

/**
 * @private
 *
 * Contains resizable and width information regarding the table as a whole
 */
export class TableMeta {
  constructor(private table: Table) {}

  @tracked scrollContainerHeight?: number;
  @tracked scrollContainerWidth?: number;

  get options() {
    return options.forTable(this.table, ColumnResizing);
  }

  get isResizable() {
    return this.options?.enabled ?? true;
  }

  get defaultColumnWidth() {
    if (!this.scrollContainerWidth) return;

    return (
      (this.scrollContainerWidth - this.totalInitialColumnWidths) /
      this.columnsWithoutInitialWidth.length
    );
  }

  get #availableColumns() {
    return columns.for(this.table, ColumnResizing);
  }

  get visibleColumnMetas() {
    return this.#availableColumns.map((column) =>
      meta.forColumn(column, ColumnResizing),
    );
  }

  get totalInitialColumnWidths() {
    return this.visibleColumnMetas.reduce(
      (acc, meta) => (acc += meta.initialWidth ?? 0),
      0,
    );
  }

  get columnsWithoutInitialWidth() {
    return this.visibleColumnMetas.filter((meta) => !meta.initialWidth);
  }

  get totalVisibleColumnsWidth() {
    return this.visibleColumnMetas.reduce(
      (acc, column) => (acc += column.width ?? 0),
      0,
    );
  }

  @action
  saveColWidths(visibleColumnMetas: ColumnMeta[]) {
    const tablePrefs = this.table.preferences;

    for (const column of visibleColumnMetas) {
      const existing = tablePrefs.storage.forPlugin('ColumnResizing');
      const columnPrefs = existing.forColumn(column.key);

      columnPrefs.set('width', column.width.toString());
    }

    tablePrefs.persist();
  }

  @action
  reset() {
    if (!this.scrollContainerWidth) return;

    for (const column of this.visibleColumnMetas) {
      column._width = undefined;
    }
  }

  @action
  onTableResize(entry: ResizeObserverEntry) {
    assert(
      'scroll container element must be an HTMLElement',
      entry.target instanceof HTMLElement,
    );

    this.scrollContainerWidth = getAccurateClientWidth(entry.target);
    this.scrollContainerHeight = getAccurateClientHeight(entry.target);

    // TODO: extract this to card-list and remove it from the plugin
    //       card-list will provide its own column-resizing plugin
    //       by sub-classing this one, and defining its own way of calculating the "diff"
    const totalGap = totalGapOf(entry.target.querySelector('[role="row"]'));
    const diff =
      this.scrollContainerWidth - this.totalVisibleColumnsWidth - totalGap;

    distributeDelta(diff, this.#availableColumns);
  }

  @action
  resizeColumn<DataType = unknown>(column: Column<DataType>, delta: number) {
    if (delta === 0) return;

    const tableLayout = this.options?.tableLayout ?? 'auto';

    if (tableLayout === 'fixed') {
      this.#resizeColumnFixed(column, delta);
    } else {
      this.#resizeColumnAuto(column, delta);
    }
  }

  /**
   * Simple column resizing for table-layout: fixed
   * Only affects the target column and respects minimum width
   */
  #resizeColumnFixed<DataType = unknown>(
    column: Column<DataType>,
    delta: number,
  ) {
    const columnMeta = meta.forColumn(column, ColumnResizing);
    const newWidth = columnMeta.width + delta;

    if (newWidth >= columnMeta.minWidth) {
      columnMeta.width = newWidth;
    }
  }

  /**
   * Complex column resizing with redistribution logic
   * Preserves existing behavior for table-layout: auto
   */
  #resizeColumnAuto<DataType = unknown>(
    column: Column<DataType>,
    delta: number,
  ) {
    /**
     * When the delta is negative, we are dragging to the next
     * when positive, we are dragging to the right
     * when dragging to the right, we want to grow the column
     * when dragging to the left, we grow the "next" column,
     * which shrinks the column we're dragging
     *
     * This assumes the resize handle for any column is on the right-hand
     * side of the column header
     *
     * If the resize handle were on the left-hand side of the column header
     * we'd want the column.next to be column.previous
     *
     * This is CSS dependent, and can be configured in plugin
     * options
     */
    const isDraggingRight = delta > 0;
    const position = this.options?.handlePosition ?? 'left';

    let growingColumn: Column<DataType> | null | undefined;

    if (position === 'right') {
      growingColumn = isDraggingRight ? columns.next(column) : column;
    } else {
      growingColumn = isDraggingRight ? columns.previous(column) : column;
    }

    if (!growingColumn) return;

    const growingColumnMeta = meta.forColumn(growingColumn, ColumnResizing);

    assert(
      'cannot resize a column that does not have a width',
      growingColumnMeta.width,
    );

    const shrinkableColumns =
      delta > 0
        ? columns.after(growingColumn)
        : columns.before(growingColumn).reverse();

    const shrinkableColumnsMetas = shrinkableColumns
      .map((column) => meta.forColumn(column, ColumnResizing))
      .filter((meta) => meta.canShrink);

    let remainder = Math.abs(delta);

    while (shrinkableColumnsMetas.length > 0) {
      const shrinkingColumnMeta = shrinkableColumnsMetas.shift();

      assert(
        'cannot resize a column that does not have a width',
        shrinkingColumnMeta?.width,
      );

      const actualDelta = Math.min(remainder, shrinkingColumnMeta.roomToShrink);

      growingColumnMeta.width += actualDelta;
      shrinkingColumnMeta.width -= actualDelta;
      remainder -= actualDelta;
    }
  }
}

/**
 * @private
 * included in the same file as the plugin due to circular dependency
 *
 * This goes on the containing element
 *
 * @example
 * ```hbs
 *  <div {{resizeObserver @table}}>
 *    <table>
 * ```
 */
function resizeObserver(element: HTMLElement, table: Table) {
  const observer = getObserver(element, table);

  observer.observe(element);

  return () => {
    observer.unobserve(element);
  };
}

const CACHE = new WeakMap<HTMLElement, ResizeObserver>();

/**
 * This is technically "inefficient" as you don't want too many resize
 * observers on a page, but tables are so big, that I don't see too many use cases
 * where you'd have 10+ tables on a page
 */
function getObserver(element: HTMLElement, table: Table): ResizeObserver {
  let existing = CACHE.get(element);

  if (existing) return existing;

  existing = new ResizeObserver((entries: ResizeObserverEntry[]) => {
    if (isDestroyed(table) || isDestroying(table)) {
      return;
    }

    for (const entry of entries) {
      meta.forTable(table, ColumnResizing).onTableResize(entry);
    }
  });

  return existing;
}
