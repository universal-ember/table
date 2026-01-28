import { TrackedMap } from 'tracked-built-ins';

import type {
  PluginPreferenceFor,
  PluginPreferences,
  PreferencesAdapter as Adapter,
  PreferencesTableValues,
  TablePreferencesData,
} from './interfaces';

export class TablePreferences {
  storage = new TrackedPreferences();

  constructor(
    private key: string,
    private adapter?: Adapter,
  ) {
    if (this.adapter) {
      this.restore(this.adapter);
    }
  }

  hasAdapter() {
    return this.adapter !== undefined;
  }

  getIsAtDefault() {
    return this.storage.isAtDefault;
  }

  /**
   * Passes a JSON-compatible structure to `adapter.persist`
   *
   * This structure could be stored in a remote database or
   * local storage. The `adpater.restore` method can be used to restore
   * this structure back in to the {@link TrackedPreferences }
   */
  persist() {
    return this.adapter?.persist?.(this.key, {
      ...this.storage.serialize(),
    });
  }

  /**
   * Using the `adapter.restore` method, convert the JSON structure
   * to {@link TrackedPreferences }
   */
  restore(adapter: Adapter) {
    const data = adapter?.restore?.(this.key);

    if (!data) return;

    return this.storage.restore(data);
  }
}

/**
 * @public
 *
 * The API for reactively interacting with preferences
 */
class TrackedPreferences {
  plugins = new TrackedMap<string, TrackedPluginPrefs>();

  get isAtDefault(): boolean {
    return [...this.plugins.values()].every(
      (pluginPrefs) => pluginPrefs.isAtDefault,
    );
  }

  getPlugin(name: string): TrackedPluginPrefs | undefined {
    return this.plugins.get(name);
  }

  forPlugin(name: string) {
    let existing = this.plugins.get(name);

    if (!existing) {
      existing = new TrackedPluginPrefs();
      this.plugins.set(name, existing);
    }

    return existing;
  }

  serialize(): TablePreferencesData {
    const plugins: TablePreferencesData['plugins'] = {};

    for (const [pluginName, preferences] of this.plugins.entries()) {
      /**
       * This cast is dirty, and should be fixed eventually.
       * We should be able to, knowing that pluginName
       * will either be in the registry, or be a default PluginPreferences
       * object, that we can assign the serialized structure to plugins.
       */
      (plugins as any)[pluginName] = preferences.serialize();
    }

    return {
      plugins,
    };
  }

  restore(data: TablePreferencesData): void {
    const { plugins } = data;

    for (const [pluginName, preferences] of Object.entries(plugins || {})) {
      const trackedPluginPrefs = new TrackedPluginPrefs();

      trackedPluginPrefs.restore(preferences);

      this.plugins.set(pluginName, trackedPluginPrefs);
    }
  }
}

class TrackedPluginPrefs<PluginName = unknown> {
  table = new TrackedMap<string, unknown>();
  columns = new TrackedMap<string, TrackedMap<string, unknown>>();

  get isAtDefault(): boolean {
    return (
      this.table.size === 0 &&
      [...this.columns.values()].every((x) => x.size === 0)
    );
  }

  getColumn = (key: string): TrackedMap<string, unknown> | undefined => {
    return this.columns.get(key);
  };

  forColumn = (key: string): TrackedMap<string, unknown> => {
    let existing = this.columns.get(key);

    if (!existing) {
      existing = new TrackedMap();
      this.columns.set(key, existing);
    }

    return existing;
  };

  serialize(): PluginPreferenceFor<PluginName> {
    const columnsPrefs: PluginPreferences['columns'] = {};
    const tablePrefs: PluginPreferences['table'] = {};

    for (const [columnKey, preferences] of this.columns.entries()) {
      const serializedPreferences: Record<string, unknown> = {};

      for (const [key, preference] of preferences.entries()) {
        serializedPreferences[key] = preference;
      }

      columnsPrefs[columnKey] = serializedPreferences;
    }

    for (const [key, preference] of this.table.entries()) {
      tablePrefs[key] = preference;
    }

    return {
      table: tablePrefs,
      columns: columnsPrefs,
    } as PluginPreferenceFor<PluginName>;
  }

  restore(data: PluginPreferences): void {
    const { table, columns } = data;

    for (const [key, preferences] of Object.entries(columns)) {
      const trackedPluginPrefs = new TrackedMap(Object.entries(preferences));

      this.columns.set(key, trackedPluginPrefs);
    }

    /**
     * TODO: fix the inference here...
     *       each time there is a cast, there is a greater risk of runtime error.
     */
    this.table = new TrackedMap<string, PreferencesTableValues<PluginName>>(
      Object.entries(table) as [string, PreferencesTableValues<PluginName>][],
    );
  }
}
