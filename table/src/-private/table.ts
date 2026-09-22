import { cached, tracked } from '@glimmer/tracking';
import { assert } from '@ember/debug';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';

import { isDevelopingApp, macroCondition } from '@embroider/macros';
import { modifier, type FunctionBasedModifier } from 'ember-modifier';
import { link } from 'reactiveweb/link';
import { map, type MappedArray } from 'reactiveweb/map';

import {
  normalizePluginsConfig,
  verifyPlugins,
} from '../plugins/-private/utils.ts';
import { Column } from './column.ts';
import { TablePreferences } from './preferences.ts';
import { Row } from './row.ts';
import { composeFunctionModifiers } from './utils.ts';

import type { BasePlugin, Plugin } from '../plugins/index.ts';
import type { Class } from './private-types.ts';
import type { TableTypeSlots } from './types.ts';
import type { ColumnConfig, Destructor, TableConfig } from './interfaces';
import type Owner from '@ember/owner';
import { compatOwner } from './ember-compat.ts';
import type { EmptyObject } from 'ember-modifier/-private/signature';

const getOwner = compatOwner.getOwner;
const setOwner = compatOwner.setOwner;

const DEFAULT_COLUMN_CONFIG = {
  isVisible: true,
  minWidth: 128,
};

/**
 * Because the table is our entry-point object to all the table behaviors,
 * we need a stable way to know which table we have.
 */
export const TABLE_KEY: unique symbol = Symbol('__TABLE_KEY__');
export const TABLE_META_KEY: unique symbol = Symbol('__TABLE_META__');
export const COLUMN_META_KEY: unique symbol = Symbol('__COLUMN_META__');
export const ROW_META_KEY: unique symbol = Symbol('__ROW_META__');

const attachContainer = (element: Element, table: Table) => {
  assert('Must be installed on an HTMLElement', element instanceof HTMLElement);

  table.scrollContainerElement = element;
};

/**
 * Symbol-keyed fields live on this interface,
 * because `isolatedDeclarations` cannot emit computed class members.
 */
export interface Table<
  DataType = unknown,
  TableTypes extends TableTypeSlots = TableTypeSlots,
> {
  /**
   * @private
   */
  [TABLE_KEY]: string;
  /**
   * @private
   */
  [TABLE_META_KEY]: Map<Class<unknown>, any>;
  /**
   * @private
   */
  [COLUMN_META_KEY]: WeakMap<Column, Map<Class<unknown>, any>>;
  /**
   * @private
   */
  [ROW_META_KEY]: WeakMap<Row, Map<Class<unknown>, any>>;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class Table<
  DataType = unknown,
  TableTypes extends TableTypeSlots = TableTypeSlots,
> {
  /**
   * @private
   *
   * Unused for now, may be used in the future.
   * This data is collected along with the scrollContainerWidth, (which is currently in use)
   */
  @tracked scrollContainerHeight?: number;

  /**
   * @private
   *
   * Used to help determine how much space we can give to columns.
   * As we generate widths for columns, the columns' widths must
   * add up to about this number.
   */
  @tracked scrollContainerWidth?: number;

  /**
   * @private
   */
  scrollContainerElement?: HTMLElement;

  #parent: object;
  #config: TableConfig<DataType, TableTypes>;

  constructor(parent: object, config: TableConfig<DataType, TableTypes>) {
    this.#parent = parent;
    this.#config = config;
    this[TABLE_KEY] = guidFor(this);
    this[TABLE_META_KEY] = new Map();
    this[COLUMN_META_KEY] = new WeakMap();
    this[ROW_META_KEY] = new WeakMap();

    /**
     * The table is destroyed with the object that created it,
     * and it uses that object's owner for its plugins.
     */
    link(this, parent);
  }

  /**
   * @private
   *
   * `link` copies the owner over, but the parent can receive its owner
   * after the table is created. A class field initializes before `setOwner`
   * runs on a manually constructed object, so the owner is read from the
   * parent on first use.
   */
  get #owner(): Owner {
    let owner = getOwner(this);

    if (!owner) {
      owner = getOwner(this.#parent);

      assert(
        `The Table does not have an owner. cannot create a plugin without an owner`,
        owner,
      );

      setOwner(this, owner);
    }

    return owner;
  }

  /**
   * @private
   *
   * used by other private APIs
   */
  get config(): TableConfig<DataType, TableTypes> {
    return this.#config;
  }

  /**
   * Interact with, save, modify, etc the preferences for the table,
   * plugins, columns, etc
   *
   * When the `preferences` config is a function, the preferences are
   * restored again every time the tracked data that the function reads changes.
   */
  @cached
  get preferences(): TablePreferences {
    const config = this.#config.preferences;
    const { key = guidFor(this), adapter } =
      (typeof config === 'function' ? config() : config) ?? {};

    // TODO: when no key is present,
    //       use "local-storage" preferences.
    //       it does not make sense to use a guid in a user's preferences
    return new TablePreferences(key, adapter);
  }

  /**
   * Collection of utility modifiers that are the result of composing modifiers
   * from plugins.
   *
   * Using this is optional, and you can "just" use modifiers from specific plugins
   * in specific places if you wish -- but these exists as a "convenience".
   *
   * These are all no-use, no-cost utilities
   */
  modifiers: {
    container: FunctionBasedModifier<{
      Element: HTMLElement;
      Args: { Positional: unknown[]; Named: EmptyObject };
    }>;
    columnHeader: FunctionBasedModifier<{
      Element: HTMLElement;
      Args: { Positional: [Column<DataType, TableTypes>]; Named: EmptyObject };
    }>;
    row: FunctionBasedModifier<{
      Element: HTMLElement;
      Args: { Positional: [Row<DataType>]; Named: EmptyObject };
    }>;
  } = {
    container: modifier((element: HTMLElement): Destructor => {
      const modifiers = this.plugins.map((plugin) => plugin.containerModifier);
      const composed = composeFunctionModifiers([
        attachContainer,
        ...modifiers,
      ]);

      return composed(element, this as Table<unknown>);
    }),

    // resize: ResizeModifier,
    // TODO: switch to composing real modifiers once "curry" and "compose"
    //       RFCs are accepted and implemented
    //
    //       Atm the moment, if _any_ header modifier's tracked data changes,
    //       all the functions for all of the plugins run again.
    //
    //       With curried+composed modifiers, only the plugin's headerModifier
    //       that has tracked changes would run, leaving the other modifiers alone
    columnHeader: modifier(
      (
        element: HTMLElement,
        [column]: [Column<DataType, TableTypes>],
      ): Destructor => {
        const modifiers = this.plugins.map(
          (plugin) => plugin.headerCellModifier,
        );
        const composed = composeFunctionModifiers(modifiers);

        return composed(element, { column, table: this });
      },
    ),

    row: modifier(
      (element: HTMLElement, [row]: [Row<DataType>]): Destructor => {
        const modifiers = this.plugins.map((plugin) => plugin.rowModifier);
        const composed = composeFunctionModifiers(modifiers);

        return composed(element, { row, table: this });
      },
    ),
  };

  /**
   * @private
   *
   * For all configured plugins, instantiates each one.
   */
  @cached
  get plugins(): Plugin[] {
    const plugins = normalizePluginsConfig(this.#config.plugins);

    verifyPlugins(plugins);

    return plugins.map((tuple) => {
      // We don't need the options here
      const [PluginClass] = tuple;

      if (typeof PluginClass === 'function') {
        const plugin = new PluginClass(this);

        setOwner(plugin, this.#owner);

        return plugin;
      }

      // This is a plugin object, rather than a class
      // TODO: add test coverage around using classless plugins
      return PluginClass;
    });
  }

  /**
   * Get the active plugin instance for the given plugin class
   */
  pluginOf<Instance extends BasePlugin<any>>(
    klass: Class<Instance>,
  ): Instance | undefined {
    const result = this.plugins.find((plugin) => plugin instanceof klass);

    /**
     * This is an unsafe cast, because Instance could be unrelated to any of the types
     * that matches Plugin[]
     *
     * For example, `table.pluginOf(MyCustomPlugin)`, where MyCustomPlugin isn't in the
     * `plugins` list. This partially a problem with how Array.prototype.find doesn't
     * effectively narrow for what we want (combined with TS being clunky around
     * comparing Instance and Class types).
     */
    return result as unknown as Instance | undefined;
  }

  rows: MappedArray<DataType[], Row<DataType>> = map(this, {
    data: () => {
      const dataFn = this.#config.data;

      if (!dataFn) return [];

      return dataFn() ?? [];
    },
    map: (datum) => new Row(this, datum),
  });

  columns: MappedArray<
    ColumnConfig<DataType, TableTypes>[],
    Column<DataType, TableTypes>
  > = map(this, {
    data: () => {
      const configFn = this.#config.columns;

      if (!configFn) return [];

      const result = configFn() ?? [];

      if (macroCondition(isDevelopingApp())) {
        /**
         * Assertions for a column config to be valid:
         * - every key must be unique
         */
        const keys = new Set();
        const allKeys = result.map((columnConfig) => columnConfig.key);

        result.forEach((columnConfig) => {
          if (keys.has(columnConfig.key)) {
            throw new Error(
              `Every column key in the table's column config must be unique. ` +
                `Found duplicate entry: ${columnConfig.key}. ` +
                `All keys used: ${allKeys}`,
            );
          }

          keys.add(columnConfig.key);
        });
      }

      return result;
    },
    map: (config) => {
      return new Column<DataType, TableTypes>(this, {
        ...DEFAULT_COLUMN_CONFIG,
        ...config,
      });
    },
  });

  /**
   * @private
   */
  @action
  resetScrollContainer(): void {
    if (!this.scrollContainerElement) return;

    this.scrollContainerElement.scrollTop = 0;
  }

  @action
  resetToDefaults(): void {
    this.plugins.forEach((plugin) => plugin.reset?.());
  }
}
