# Changelog

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
