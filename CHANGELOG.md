# Changelog

## Release (2025-11-11)

@universal-ember/table 3.4.0 (minor)

#### :rocket: Enhancement
* `docs-app`, `@universal-ember/table`, `test-app`
  * [#125](https://github.com/universal-ember/table/pull/125) add isResizable helper ([@johanrd](https://github.com/johanrd))
  * [#124](https://github.com/universal-ember/table/pull/124) feat(column-reordering): add orderedColumnsFor helper + fix two skipped tests ([@johanrd](https://github.com/johanrd))

#### :bug: Bug Fix
* `@universal-ember/table`, `test-app`
  * [#126](https://github.com/universal-ember/table/pull/126) fix failing test for handlePosition  ([@johanrd](https://github.com/johanrd))

#### Committers: 1
- [@johanrd](https://github.com/johanrd)

## Release (2025-11-06)

@universal-ember/table 3.3.0 (minor)

#### :rocket: Enhancement
* `@universal-ember/table`
  * [#122](https://github.com/universal-ember/table/pull/122) Prevent auto-redistributing with tableLayout: 'fixed'  ([@johanrd](https://github.com/johanrd))
* `docs-app`, `@universal-ember/table`, `test-app`
  * [#120](https://github.com/universal-ember/table/pull/120) Add table-level defaultCellValue config option ([@johanrd](https://github.com/johanrd))

#### :bug: Bug Fix
* `@universal-ember/table`
  * [#121](https://github.com/universal-ember/table/pull/121) Fixes infinite resize loop at non-100% zoom levels caused by subpixel rounding errors. ([@johanrd](https://github.com/johanrd))

#### :memo: Documentation
* [#112](https://github.com/universal-ember/table/pull/112) Add thank you to the contributors ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### :house: Internal
* [#113](https://github.com/universal-ember/table/pull/113) docs(contributor): contributors readme action update ([@github-actions[bot]](https://github.com/apps/github-actions))

#### Committers: 3
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)
- [@github-actions[bot]](https://github.com/apps/github-actions)
- [@johanrd](https://github.com/johanrd)

## Release (2025-10-03)

@universal-ember/table 3.2.0 (minor)

#### :rocket: Enhancement
* `docs-app`, `@universal-ember/table`, `test-app`
  * [#74](https://github.com/universal-ember/table/pull/74) Reordering hidden columns ([@johanrd](https://github.com/johanrd))

#### :bug: Bug Fix
* `docs-app`, `@universal-ember/table`, `test-app`
  * [#74](https://github.com/universal-ember/table/pull/74) Reordering hidden columns ([@johanrd](https://github.com/johanrd))

#### :memo: Documentation
* `docs-app`
  * [#109](https://github.com/universal-ember/table/pull/109) chore: Fix file name spelling ([@jayden-leuciuc](https://github.com/jayden-leuciuc))
  * [#105](https://github.com/universal-ember/table/pull/105) docs: Single row selection link ([@MichalBryxi](https://github.com/MichalBryxi))

#### Committers: 3
- Jayden Leuciuc ([@jayden-leuciuc](https://github.com/jayden-leuciuc))
- Michal Bryxí ([@MichalBryxi](https://github.com/MichalBryxi))
- [@johanrd](https://github.com/johanrd)

## Release (2025-08-25)

@universal-ember/table 3.1.1 (patch)

#### :bug: Bug Fix
* `@universal-ember/table`
  * [#99](https://github.com/universal-ember/table/pull/99) Pass through generics to `ComponentLike<CellContext<T>>` ([@johanrd](https://github.com/johanrd))

#### Committers: 1
- [@johanrd](https://github.com/johanrd)

## Release (2025-08-25)

@universal-ember/table 3.1.0 (minor)

#### :rocket: Enhancement
* `docs-app`, `@universal-ember/table`, `test-app`
  * [#97](https://github.com/universal-ember/table/pull/97) Simple column resizing setting with `tableLayout: 'fixed'` ([@johanrd](https://github.com/johanrd))

#### Committers: 1
- [@johanrd](https://github.com/johanrd)

## Release (2025-08-25)

@universal-ember/table 3.0.4 (patch)

#### :bug: Bug Fix
* `@universal-ember/table`, `test-app`
  * [#95](https://github.com/universal-ember/table/pull/95) Make sure generics are passed into helpers ([@johanrd](https://github.com/johanrd))

#### :memo: Documentation
* `docs-app`
  * [#68](https://github.com/universal-ember/table/pull/68) double FPS in "Lots of data (no virtualization)" when utilising key in #each ([@johanrd](https://github.com/johanrd))

#### Committers: 1
- [@johanrd](https://github.com/johanrd)

## Release (2025-03-27)

@universal-ember/table 3.0.3 (patch)

#### :bug: Bug Fix
* `@universal-ember/table`
  * [#66](https://github.com/universal-ember/table/pull/66) Include declarations ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### Committers: 1
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)

## Release (2025-03-27)

@universal-ember/table 3.0.2 (patch)

#### :bug: Bug Fix
* `docs-app`, `@universal-ember/table`, `test-app`
  * [#63](https://github.com/universal-ember/table/pull/63) Upgrade addon-dev to fix declaration output ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### :memo: Documentation
* [#64](https://github.com/universal-ember/table/pull/64) Fix docs deploy ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### Committers: 1
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)

## Release (2025-03-27)

@universal-ember/table 3.0.1 (patch)

#### :bug: Bug Fix
* `@universal-ember/table`
  * [#62](https://github.com/universal-ember/table/pull/62) Fix publish ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### :memo: Documentation
* Other
  * [#54](https://github.com/universal-ember/table/pull/54) Update README.md with link to docs-app ([@johanrd](https://github.com/johanrd))
* `docs-app`
  * [#55](https://github.com/universal-ember/table/pull/55) Fix api docs (typedocs) ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### Committers: 2
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)
- [@johanrd](https://github.com/johanrd)

## Release (2025-03-23)

@universal-ember/table 3.0.0 (major)

#### :boom: Breaking Change
* Other
  * [#47](https://github.com/universal-ember/table/pull/47) Drop support for TS 5.4 and lower, add support for TS 5.8 ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
* `docs-app`, `@universal-ember/table`, `test-app`
  * [#15](https://github.com/universal-ember/table/pull/15) Remove support for @types/ember*, now only supporting the official types from ember-source ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### :rocket: Enhancement
* `docs-app`, `@universal-ember/table`, `test-app`
  * [#22](https://github.com/universal-ember/table/pull/22) Upgrade to ember-resources v7 ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
* `docs-api`, `docs-app`, `@universal-ember/table`, `test-app`
  * [#12](https://github.com/universal-ember/table/pull/12) Rename ember-headless-table to @universal-ember/table ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### :bug: Bug Fix
* `docs-app`, `@universal-ember/table`, `test-app`
  * [#42](https://github.com/universal-ember/table/pull/42) Fix types ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
* `docs-app`
  * [#18](https://github.com/universal-ember/table/pull/18) Resolve vuln: upgrade dompurify to v3 ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### :memo: Documentation
* `docs-api`, `docs-app`, `test-app`
  * [#32](https://github.com/universal-ember/table/pull/32) Use Vite (docs, tests) / Rewrite the docs / document things in terms of gjs and gts ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### :house: Internal
* `docs-app`, `test-app`
  * [#52](https://github.com/universal-ember/table/pull/52) Fix ember-try config ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
  * [#16](https://github.com/universal-ember/table/pull/16) Fix the repository field in package.json ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
  * [#11](https://github.com/universal-ember/table/pull/11) Upgrade linting (ESLint 9, Prettier 3, etc) ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
  * [#9](https://github.com/universal-ember/table/pull/9) Replace internal sync-pnpm with the extracted pnpm-sync-dependencies-meta-injected ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
  * [#5](https://github.com/universal-ember/table/pull/5) Upgrade local dev node from 14/16 to 22+ ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
* Other
  * [#49](https://github.com/universal-ember/table/pull/49) Update Cloudflare Deploy ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
  * [#38](https://github.com/universal-ember/table/pull/38) Update artifact actions ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
  * [#33](https://github.com/universal-ember/table/pull/33) Use stricter .npmrc settings ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
  * [#28](https://github.com/universal-ember/table/pull/28) Use a more targeted patch for github-changelog which prevents referencing the old repo ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
  * [#26](https://github.com/universal-ember/table/pull/26) Drop support for TS < 5.1, test against TS 5.1+ ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
  * [#24](https://github.com/universal-ember/table/pull/24) Use shared renovate config from NullVoxPopuli/renovate ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
  * [#23](https://github.com/universal-ember/table/pull/23) Fix patch for github-changelog ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
  * [#21](https://github.com/universal-ember/table/pull/21) Update github-changelog patch ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
  * [#20](https://github.com/universal-ember/table/pull/20) Upgrade turbo ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
  * [#14](https://github.com/universal-ember/table/pull/14) Don't use node18 in release-plan ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
  * [#10](https://github.com/universal-ember/table/pull/10) Update CI.yml, remove custom pnpm action ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
  * [#7](https://github.com/universal-ember/table/pull/7) Add release-plan ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
  * [#6](https://github.com/universal-ember/table/pull/6) Set pnpm to v10 ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
* `docs-api`, `docs-app`, `@universal-ember/table`, `test-app`
  * [#44](https://github.com/universal-ember/table/pull/44) Get test-app's tests working and passing again (with Vite) ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
  * [#40](https://github.com/universal-ember/table/pull/40) Prepare for vite migration ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
  * [#13](https://github.com/universal-ember/table/pull/13) Modernize build (upgrade rollup, TS, addon-dev, use extensions in imports) ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
* `@universal-ember/table`
  * [#45](https://github.com/universal-ember/table/pull/45) Remove type aliases ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
  * [#36](https://github.com/universal-ember/table/pull/36) Upgrade addon-dev ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
  * [#19](https://github.com/universal-ember/table/pull/19) Fix URL change for Release ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
* `test-app`
  * [#43](https://github.com/universal-ember/table/pull/43) lint:fix test-app ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
  * [#27](https://github.com/universal-ember/table/pull/27) Test against 3.28+, and first and last LTS of each major thereafter ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
  * [#25](https://github.com/universal-ember/table/pull/25) Only test against embroider (broccoli builds don't matter for this library) ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
* `docs-app`, `@universal-ember/table`, `test-app`
  * [#41](https://github.com/universal-ember/table/pull/41) run prettier on everything ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
  * [#37](https://github.com/universal-ember/table/pull/37) Update lint dependencies ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
  * [#35](https://github.com/universal-ember/table/pull/35) Update prettier config ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
  * [#34](https://github.com/universal-ember/table/pull/34) Upgrade prettier (so that CSS in template tag / gjs / gts is supported) ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
  * [#17](https://github.com/universal-ember/table/pull/17) Update the author and remove directories key ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
* `docs-app`
  * [#39](https://github.com/universal-ember/table/pull/39) Remove references to docfy and crowdstrike ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
* `docs-api`
  * [#29](https://github.com/universal-ember/table/pull/29) Upgraed typedoc ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### Committers: 1
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)


## 2.1.4

### Patch Changes

- [#236](https://github.com/CrowdStrike/ember-headless-table/pull/236) [`3a737e9`](https://github.com/CrowdStrike/ember-headless-table/commit/3a737e93e647074119c613a4b444d51c38f12e4c) Thanks [@NullVoxPopuli](https://github.com/NullVoxPopuli)! - Use more permissive peer ranges for `@ember/test-helpers`, `@ember/test-waiters`, and `ember-source`.

## 2.1.3

### Patch Changes

- [#233](https://github.com/CrowdStrike/ember-headless-table/pull/233) [`4dbf668`](https://github.com/CrowdStrike/ember-headless-table/commit/4dbf6682b4b85d27e57821c68a82b376256121e1) Thanks [@joelamb](https://github.com/joelamb)! - Fixes column resize and preference save sequencing
  to ensure that the functions always run in the correct order.

## 2.1.2

### Patch Changes

- [#226](https://github.com/CrowdStrike/ember-headless-table/pull/226) [`6c58dfd`](https://github.com/CrowdStrike/ember-headless-table/commit/6c58dfdcdfca02fb087f99813e484afdc04a2b51) Thanks [@nicolechung](https://github.com/nicolechung)! - Bugfix: the plugin for resize was not checking if the table was destroyed first.

  This fixes that so the observer is not listening for a removed table, which was causing an error in the preferences (since it was trying to set preferences for a table which is not on screen)

## 2.1.1

### Patch Changes

- [#219](https://github.com/CrowdStrike/ember-headless-table/pull/219) [`4172870`](https://github.com/CrowdStrike/ember-headless-table/commit/4172870114ec87b0df8473a1caa3b92f027b4a3e) Thanks [@joelamb](https://github.com/joelamb)! - Column widths are saved and reset in a single call to the preferences service,
  rather than on a per column basis, for improved UI performance

## 2.1.0

### Minor Changes

- [#211](https://github.com/CrowdStrike/ember-headless-table/pull/211) [`0a9415c`](https://github.com/CrowdStrike/ember-headless-table/commit/0a9415c3c859ad0000c5e37503f7786825baed91) Thanks [@joelamb](https://github.com/joelamb)! - Persists resized column widths to preferences.
  Width values are saved as strings after resizing.
  If present in preferences, width value will be
  restored to the table, overriding any initial options
  passed in.

### Patch Changes

- [#214](https://github.com/CrowdStrike/ember-headless-table/pull/214) [`58b2866`](https://github.com/CrowdStrike/ember-headless-table/commit/58b28666270fd47e96525fbe6547449f1eeb32da) Thanks [@joelamb](https://github.com/joelamb)! - Refactor to bulk reset column visibility preferences in a single call to
  the preferences service

## 2.0.0

### Major Changes

- [#176](https://github.com/CrowdStrike/ember-headless-table/pull/176) [`f3435c3`](https://github.com/CrowdStrike/ember-headless-table/commit/f3435c37d5aa95b9d6593c5f06142d85cb9fc6a4) Thanks [@NullVoxPopuli](https://github.com/NullVoxPopuli)! - In prepr for supporting Glint 1.0,
  ember-headless-table no longer will support TypeScript < 4.8.

  Additionally, the support policy is changing from a minimum version, to a [rolling window](https://www.semver-ts.org/#decouple-typescript-support-from-lts-cycles) policy, as described in https://semver-ts.org.

  The current and prior two TypeScript versions will be supported, giving a rolling window of 3 TypeScript versions.

### Patch Changes

- [#175](https://github.com/CrowdStrike/ember-headless-table/pull/175) [`4681eca`](https://github.com/CrowdStrike/ember-headless-table/commit/4681eca01726868d8c5b9abd483bdaac59fdb24f) Thanks [@NullVoxPopuli](https://github.com/NullVoxPopuli)! - Officially support Glint 1.0+

- [#200](https://github.com/CrowdStrike/ember-headless-table/pull/200) [`ced9ca3`](https://github.com/CrowdStrike/ember-headless-table/commit/ced9ca399b7050149cdca78cfa0001a42b963509) Thanks [@joelamb](https://github.com/joelamb)! - fix: save table column order on setAll

## 1.4.5

### Patch Changes

- [#157](https://github.com/CrowdStrike/ember-headless-table/pull/157) [`57091d0`](https://github.com/CrowdStrike/ember-headless-table/commit/57091d042cdb96a67b933fbac3c0aa6ed941f2cc) Thanks [@nicolechung](https://github.com/nicolechung)! - Added toStyle helper in column-resizing plugin > helper. This should fix when a `minWidth` is passed in the column config and not getting converted to `min-width` for the style attribute string.

## 1.4.4

### Patch Changes

- [#148](https://github.com/CrowdStrike/ember-headless-table/pull/148) [`9b9fbe1`](https://github.com/CrowdStrike/ember-headless-table/commit/9b9fbe14a16407a2edaa056e8ff5e3faf8b5aa39) Thanks [@NullVoxPopuli](https://github.com/NullVoxPopuli)! - Support ember-source@4.12. Test ember-source@v5 to the allowed peer versions for headless-table

- [#149](https://github.com/CrowdStrike/ember-headless-table/pull/149) [`8b8f170`](https://github.com/CrowdStrike/ember-headless-table/commit/8b8f1703f44df971506184b639719a34ee993060) Thanks [@nicolechung](https://github.com/nicolechung)! - Bugfix, change minWidth to min-width for the Sticky columns plugin

## 1.4.3

### Patch Changes

- [#118](https://github.com/CrowdStrike/ember-headless-table/pull/118) [`c02d49d`](https://github.com/CrowdStrike/ember-headless-table/commit/c02d49d0fe4f98d77404abe87ff2d8e1aefb4139) Thanks [@NullVoxPopuli](https://github.com/NullVoxPopuli)! - Address an issue where instances of plugins would be held on to after a Table is destroyed.

  This caused a memory leak due how plugins, and their associated metadata, held on to
  Table instances, which in turn, held on to the owner / container.

  This was caused by the utility methods in `ember-headless-table/plugins`,

  - `preferences`
  - `meta`
  - `options`

  Because data was stored in (Weak)Maps in module-space.
  This alone isn't a problem, but they were never cleaned up when the table was destroyed.

  Cleanup of these objects could have occured via `associateDestroyableChild` and `registerDestructor`
  from `@ember/destroyable`, but it was easier to instead have this happen automatically via hosting the
  data needed for the "plugins utils" on the table itself. Since each plugin util requires "some instance of something",
  be that a row, column, or table, there is a direct path to the table, and therefor a direct way to access
  memory-scoped (Weak)Maps.

## 1.4.2

### Patch Changes

- [#123](https://github.com/CrowdStrike/ember-headless-table/pull/123) [`972749b`](https://github.com/CrowdStrike/ember-headless-table/commit/972749b4d8f4743da354e0120a07489d973ad2b4) Thanks [@NullVoxPopuli](https://github.com/NullVoxPopuli)! - Fix an issue where columns using the ColumnResize plugin with the option isResizing set to false, the plugin could not recognize the column as having resizing turned off"

## 1.4.1

### Patch Changes

- [#121](https://github.com/CrowdStrike/ember-headless-table/pull/121) [`2175782`](https://github.com/CrowdStrike/ember-headless-table/commit/2175782e275359ed75a2835c035aedc44cb1ddd3) Thanks [@NullVoxPopuli](https://github.com/NullVoxPopuli)! - Add new util for the resizing plugin to help styles cells in non-header rows in non-tables (such as [grids][grid]).

  [grid]: https://www.w3.org/WAI/ARIA/apg/example-index/grid/LayoutGrids#htmlsourcecode

  To use it,

  ```gjs
  import { styleStringFor } from "ember-headless-table/plugins/column-resizing";

  // ...

  // rows.gjs
  <template>
    {{#each @table.rows as |row|}}
      <div role="row">
        {{#each @table.columns as |column|}}
          <div
            role="cell"
            style={{styleStringFor column}}
          >{{column.getValueForRow row}}</div>
        {{/each}}
      </div>
    {{/each}}
  </template>
  ```

## 1.4.0

### Minor Changes

- [#110](https://github.com/CrowdStrike/ember-headless-table/pull/110) [`a9c19c7`](https://github.com/CrowdStrike/ember-headless-table/commit/a9c19c7db7475bd133deded2e7afb84eb0354082) Thanks [@NullVoxPopuli](https://github.com/NullVoxPopuli)! - Add new "query" util: `hasPlugin`, allowing consumers of the headlessTable to
  ask if a plugin is active and get a boolean response.

  Example:

  ```js
  import { headlessTable } from "ember-headless-table";
  import { hasPlugin } from "ember-headless-table/plugins";
  import { DataSorting } from "ember-headless-table/plugins/data-sorting";

  // ... ✂️ ...
  let table = headlessTable(this, {
    columns: () => [],
    data: () => [],
    plugins: [DataSorting],
  });

  hasPlugin(table, DataSorting); // => true
  ```

### Patch Changes

- [#108](https://github.com/CrowdStrike/ember-headless-table/pull/108) [`40649c9`](https://github.com/CrowdStrike/ember-headless-table/commit/40649c90d7145e2b83e10e9dffd050900fc4cc52) Thanks [@NullVoxPopuli](https://github.com/NullVoxPopuli)! - `deserializeSorts` now will gracefully return an empty array upon receiving empty input.

  Example:

  ```js
  import { deserializeSorts } from "ember-headless-table";

  deserializeSorts(""); // => []
  ```

  Previously, an error would be reported:

  ```
  No key found for input: `` using `.` as a separator
  ```

  which wasn't all that helpful.

  When using the data-sorting plugin with this util, it is perfectly safe to "deserialize sorts" to an empty array
  and have that empty array be equivelant to no sorting being applied at all.

## 1.3.0

### Minor Changes

- [#94](https://github.com/CrowdStrike/ember-headless-table/pull/94) [`310a6e0`](https://github.com/CrowdStrike/ember-headless-table/commit/310a6e037ba307f9587a0264ed73bfaa4e6bed63) Thanks [@NullVoxPopuli](https://github.com/NullVoxPopuli)! - An alternative, yet more verbose, option is now available for the sticky / pinnable columns plugin.

  This is, in part, due to waiting on
  [RFC#883: add new timing capabilities to modifier manager](https://github.com/emberjs/rfcs/pull/883).

  But also, as an escape hatch for performance sensitive situations where one would want to avoid altering any style attributes during render (as is one of the primary use cases of RFC#883) as this causes repaint calculations and degraded performance in the browser.

  This new technique for the sticky/pinnable colums plugin allows you to set the `style` attribute so that the browser can calculate layout in a single pass.

  To opt in to this, two things must be done:

  1. invoke the `styleStringFor` helper in the template, and set the result to the `style` attribute for the `th` and `td` cells.

     ```gjs
     import { styleStringFor } from "ember-headless-table/plugins/sticky-columns";

     // ...

     <template>
       <div class="h-full overflow-auto">
         <table>
           <thead>
             <tr class="relative">
               {{#each @table.columns as |column|}}
                 <th style="{{styleStringFor column}}">
                   {{column.name}}
                 </th>
               {{/each}}
             </tr>
           </thead>
           <tbody>
             {{#each @table.rows as |row|}}
               <tr class="relative">
                 {{#each @table.columns as |column|}}
                   <td style="{{styleStringFor column}}">
                     {{column.getValueForRow row}}
                   </td>
                 {{/each}}
               </tr>
             {{/each}}
           </tbody>
         </table>
       </div>
     </template>
     ```

  2. when configuring the `StickyColumns` plugin in `headlessTable`, configure the the `workaroundForModifierTimingUpdateRFC883` flag to `true`. This allows td and th cells to have modifiers without causing repaints due to style changes caused by the sticky columns plugin.

  ```js
  class Example {
    table = headlessTable(this, {
      columns: () => [
        // ...
      ],
      // ...
      plugins: [
        StickyColumns.with(() => ({
          workaroundForModifierTimingUpdateRFC883: true,
        })),
      ],
    });
  }
  ```

### Patch Changes

- [#81](https://github.com/CrowdStrike/ember-headless-table/pull/81) [`57c22d4`](https://github.com/CrowdStrike/ember-headless-table/commit/57c22d4456efa2d4a4212e24cf31d06c51240565) Thanks [@NullVoxPopuli](https://github.com/NullVoxPopuli)! - Prevent hard-to-debug issues that occur with incorrect column configs.
  One such way problems can occur is when the `key` property is duplicated
  for multiple column configs.

  This is now eagerly prevented via dev-time Error.
  All the column config validity checking code is removed in production builds
  via `@embroider/macros` `macroCondition(isDevelopingApp())`.

## 1.2.0

### Minor Changes

- [#58](https://github.com/CrowdStrike/ember-headless-table/pull/58) [`f885ebb`](https://github.com/CrowdStrike/ember-headless-table/commit/f885ebb5aa19f9daf1697f0edd907e39e27827d5) Thanks [@NullVoxPopuli](https://github.com/NullVoxPopuli)! - New _Metadata_ plugin, for allowing arbitrary data to be stored for each column as well as the whole table.
  This can be useful eliminating prop-drilling in a UI Table implementation consuming the
  headlessTable.

  For example, setting up the table can be done like:

  ```js
  import { headlessTable } from "ember-headless-table";

  class Example {
    /* ... */

    table = headlessTable(this, {
      columns: () => [
        { name: "A", key: "A" },
        {
          name: "B",
          key: "B",
          pluginOptions: [
            Metadata.forColumn(() => ({
              isBulkSelectable: false,
            })),
          ],
        },
        {
          name: "D",
          key: "D",
          pluginOptions: [Metadata.forColumn(() => ({ isRad: this.dRed }))],
        },
      ],
      data: () => DATA,
      plugins: [
        Metadata.with(() => ({
          onBulkSelectionChange: (...args) => this.doSomething(...args),
        })),
      ],
    });
  }
  ```

  To allow "bulk selection" behaviors to be integrated into how the Table is rendered --
  which for fancier tables, my span multiple components.

  For example: rows may be their own component

  ```gjs
  // Two helpers are provided for accessing your Metadata
  import {
    forColumn /*, forTable */,
  } from "ember-headless-table/plugins/metadata";

  const isBulkSelectable = (column) => forColumn(column, "isBulkSelectable");

  export const Row = <template>
    <tr>
      {{#each @table.columns as |column|}}
        {{#if (isBulkSelectable column)}}

          ... render some checkbox UI ...

        {{else}}
          <td>
            {{column.getValueForRow @datum}}
          </td>
        {{/if}}
      {{/each}}
    </tr>
  </template>;
  ```

- [#66](https://github.com/CrowdStrike/ember-headless-table/pull/66) [`3075a5c`](https://github.com/CrowdStrike/ember-headless-table/commit/3075a5ccc04be95e0392e3cc0c8e589439df4a02) Thanks [@NullVoxPopuli](https://github.com/NullVoxPopuli)! - Add a new API for the column-reordering plugin that allows for
  managing column order independently of the table's column order,
  for example, in a configuration UI / preview, one may want to
  see how their changes will look before applying them to the table.

  To use this new API, there are two relevant imports:

  ```js
  import {
    ColumnOrder,
    setColumnOrder,
  } from "ember-headless-table/plugins/column-reordering";
  ```

  To manage the "preview column order",
  you'll want to instantiate the `ColumnOrder` class,
  and then once your changes are done, call `setColumnOrder` and pass
  both the table and the `ColumnOrder` instance:

  ```js
  class Demo {
    @tracked pendingColumnOrder;

    changeColumnOrder = () => {
      this.pendingColumnOrder = new ColumnOrder({
        columns: () => this.columns,
      });
    };

    handleReconfigure = () => {
      setColumnOrder(this.table, this.pendingColumnOrder);
      this.pendingColumnOrder = null;
    };
  }
  ```

  In this example, when working with `this.pendingColumnOrder`, you may use
  familiar "moveLeft" and "moveRight" behaviors,

  ```hbs
  {{#let this.pendingColumnOrder as |order|}}

    {{#each order.orderedColumns as |column|}}

      <button {{on "click" (fn order.moveLeft column.key)}}> ⇦ </button>

      {{column.name}}

      <button {{on "click" (fn order.moveRight column.key)}}> ⇨ </button>

    {{/each}}

    <button {{on "click" this.handleReconfigure}}>Submit changes</button>
  {{/let}}
  ```

### Patch Changes

- [#63](https://github.com/CrowdStrike/ember-headless-table/pull/63) [`ecb68ff`](https://github.com/CrowdStrike/ember-headless-table/commit/ecb68ff8d507dd70a48cd0fbf1b5368c03a1544c) Thanks [@NullVoxPopuli](https://github.com/NullVoxPopuli)! - Previously, ember-headless-table's releases were managed by semantic-release.
  Now, they are managed by changesets, which is a bit more manual, but has far better
  monorepo support and allows catering to humans when it comes to changelogs.

- [#61](https://github.com/CrowdStrike/ember-headless-table/pull/61) [`0356997`](https://github.com/CrowdStrike/ember-headless-table/commit/035699770afd1a40c16ed251fe4f8cdd7860db3a) Thanks [@NullVoxPopuli](https://github.com/NullVoxPopuli)! - Fixes the issue reported in https://github.com/CrowdStrike/ember-headless-table/issues/60
  Where the column reordering and visibility plugins were not integrating well together.
  In short, moving column, then hiding that same column, then moving a column "over the gap"
  between the columns resulted in all column reordering no longer working.
  Using both of the plugins together should now work as intuitively expected.

### Features

- **plugin, resizing:** add helper for knowing if a column has a resize handle ([f525f50](https://github.com/CrowdStrike/ember-headless-table/commit/f525f50b4002766145187e8c19cce84e62605839))

## [1.0.1](https://github.com/CrowdStrike/ember-headless-table/compare/v1.0.0...v1.0.1) (2022-11-06)

### Bug Fixes

- **deps:** update dependency highlightjs-glimmer to v2 ([0881e12](https://github.com/CrowdStrike/ember-headless-table/commit/0881e12bb091daf711e3712151f26b6e6cd9ace5))

# 1.0.0 (2022-11-02)

### Bug Fixes

- **column-reordering:** reordering reactivity restored ([bf8153c](https://github.com/CrowdStrike/ember-headless-table/commit/bf8153c945e7215dd286ad74b9ffb2b77b3a4e47))
- **columnReordering:** rework how order state is maintained ([39ae71e](https://github.com/CrowdStrike/ember-headless-table/commit/39ae71ebb825d94d939fa5327ee75352734e92fd))
- **columnResizing:** fix the resize-handle modifier ([e17c232](https://github.com/CrowdStrike/ember-headless-table/commit/e17c23221c92d1507ef9b357311f6c3c978cbd12))
- **columnResizing:** resizeHandle modifier needs to be an ember-modifier ([90f7577](https://github.com/CrowdStrike/ember-headless-table/commit/90f7577512e82ac44e02e681860634ac7707d8d3))
- **columnVisibility:** bug where default hidden could not be unhidden ([e6b7239](https://github.com/CrowdStrike/ember-headless-table/commit/e6b72399b9efecc64ee056321bbabfb56eee5302))
- **columnVisibility:** work around a bug with tracked-built-ins' delete not being reactive ([ce62498](https://github.com/CrowdStrike/ember-headless-table/commit/ce624988ea72f0d471002ba4472eda5886ab9e0c))
- **columnVisibilty:** bug where default / preferences clearing calculation was incorrect ([e3e8480](https://github.com/CrowdStrike/ember-headless-table/commit/e3e84805e0a42c70d098a45f206a42e7be4b918f))
- **deps:** update dependency @ember/test-waiters to ^3.0.2 ([dcb45d1](https://github.com/CrowdStrike/ember-headless-table/commit/dcb45d19677c3cbc3ad38066ed2923f9e2974a37))
- **resizing:** resizing depends on column order, not just visibility ([6ac95ef](https://github.com/CrowdStrike/ember-headless-table/commit/6ac95ef47b02bf191103d8cca9d19b350e2a1342))

### Features

- **columnReordering:** preferences are now persisted and read from ([96e13c1](https://github.com/CrowdStrike/ember-headless-table/commit/96e13c10f4a9edf700ee5f7aaa1ecf784568ad33))
- initial implementation ([0fc2cbc](https://github.com/CrowdStrike/ember-headless-table/commit/0fc2cbcd5e274836ca6ab41fe2b9379a6adda812))
- **plugin:** implement row selection plugin ([e46ce50](https://github.com/CrowdStrike/ember-headless-table/commit/e46ce50480fcb510b88074fadd92027e6ffa01d9))
- **plugins:** simplify working with columns among plugins ([48ef0bb](https://github.com/CrowdStrike/ember-headless-table/commit/48ef0bbfba8cf677be09c5c40e8152b46a64e074))
- **plugin:** sticky columns ([b9b8bfa](https://github.com/CrowdStrike/ember-headless-table/commit/b9b8bfa476490af783d78f2992d9278874e33608))
- **table:** support [@use](https://github.com/use) ([6561c30](https://github.com/CrowdStrike/ember-headless-table/commit/6561c305f1998c9ce0283b9dfcd79f45fd7aa7d4))

### BREAKING CHANGES

- brand new addon

* copied code from internal project
* successful build

This is an incremental step, as there is some dev work yet to complete

- [ ] finish plugins work
- [ ] rename `@crowdstrike/ember-headless-table` to `ember-headless-table`
- [ ] Button up C.I.
- [ ] Create docs site with lots of examples, how to write plugins, etc
