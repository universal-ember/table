import { assert } from '@ember/debug';

import type { BasePlugin } from './base';
import type { Constructor } from '../../-private/private-types';
import type { Plugin } from '../../plugins';

type PluginOption =
  | Constructor<Plugin<any>>
  | [Constructor<Plugin<any>>, () => any];

type ExpandedPluginOption = [Constructor<Plugin<any>>, () => any];

export type Plugins = PluginOption[];

export function normalizePluginsConfig(
  plugins?: Plugins,
): ExpandedPluginOption[] {
  if (!plugins) return [];

  const result: ExpandedPluginOption[] = [];

  for (const plugin of plugins) {
    if (!Array.isArray(plugin)) {
      result.push([plugin, () => ({})]);

      continue;
    }

    if (plugin.length === 2) {
      result.push([plugin[0], plugin[1]]);

      continue;
    }

    result.push([plugin[0], () => ({})]);
  }

  assert(
    `Every entry in the plugins config must be invokable`,
    result.every(
      (tuple) =>
        typeof tuple[0] === 'function' && typeof tuple[1] === 'function',
    ),
  );

  return result;
}

/**
 * Creates a map of featureName => [plugins providing said feature name]
 */
function collectFeatures(plugins: ExpandedPluginOption[]) {
  const result: Record<string, { name: string }[]> = {};

  for (const [plugin] of plugins) {
    if ('features' in plugin) {
      for (const feature of (plugin as unknown as typeof BasePlugin).features ||
        []) {
        result[feature] = [...(result[feature] || []), plugin];
      }
    }
  }

  return result;
}

/**
 * Creates a map of requirement => [plugins requesting the feature / requirement]
 */
function collectRequirements(plugins: ExpandedPluginOption[]) {
  const result: Record<string, { name: string }[]> = {};

  for (const [plugin] of plugins) {
    if ('requires' in plugin) {
      for (const requirement of (plugin as unknown as typeof BasePlugin)
        .requires || []) {
        result[requirement] = [...(result[requirement] || []), plugin];
      }
    }
  }

  return result;
}

export function verifyPlugins(plugins: ExpandedPluginOption[]) {
  const features = collectFeatures(plugins);
  const requirements = collectRequirements(plugins);
  const allFeatures = Object.keys(features);
  const errors: string[] = [];

  // Only one plugin can provide each feature
  for (const [feature, providingPlugins] of Object.entries(features)) {
    if (providingPlugins.length > 1) {
      errors.push(
        `More than one plugin is providing the feature: ${feature}. ` +
          `Please remove one of ${providingPlugins.map((p) => p.name).join(', ')}`,
      );
    }
  }

  for (const [requirement, requestingPlugins] of Object.entries(requirements)) {
    if (!allFeatures.includes(requirement)) {
      errors.push(
        `Configuration is missing requirement: ${requirement}, ` +
          `And is requested by ${requestingPlugins.map((p) => p.name).join(', ')}. ` +
          `Please add a plugin with the ${requirement} feature`,
      );
    }
  }

  if (errors.length > 0) {
    throw new Error(errors.join('\n'));
  }
}

type AssignableStyles = Omit<CSSStyleDeclaration, 'length' | 'parentRule'>;

/**
 * @public
 *
 * Utility that helps safely apply styles to an element
 */
export function applyStyles(
  element: HTMLElement | SVGElement,
  styles: Partial<AssignableStyles>,
) {
  for (const [name, value] of Object.entries(styles)) {
    if (name in element.style) {
      assignStyle(
        element,
        name as keyof CSSStyleDeclaration,
        value as CSSStyleDeclaration[keyof CSSStyleDeclaration],
      );
    }
  }
}

type StyleDeclarationFor<MaybeStyle> =
  MaybeStyle extends keyof CSSStyleDeclaration ? MaybeStyle : never;

function assignStyle<StyleName>(
  element: HTMLElement | SVGElement,
  styleName: StyleDeclarationFor<StyleName>,
  value: CSSStyleDeclaration[StyleDeclarationFor<StyleName>],
) {
  element.style[styleName] = value;
}

function removeStyle(element: HTMLElement | SVGElement, styleName: string) {
  element.style.removeProperty(styleName);
}

/**
 * @public
 *
 * Utility that helps safely remove styles from an element
 */
export function removeStyles(
  element: HTMLElement | SVGElement,
  styles: Array<keyof AssignableStyles>,
) {
  for (const name of styles) {
    if (typeof name !== 'string') continue;
    removeStyle(element, name);
  }
}
