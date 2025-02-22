# How To Contribute

## Installation

* `git clone <repository-url>`
* `cd @universal-ember/table`
* `pnpm install`

## Linting

* `pnpm lint`
* `pnpm lint:fix`

## Building the addon

* `cd @universal-ember/table`
* `pnpm build`

## Running tests

* `cd test-app`
* `pnpm start` – starts the test app and tests are available at `/tests`
* `pnpm test:ember` – runs the ember tests for the current environment

## Running the docs app

* `cd docs-app`
* `pnpm start` – starts the test app and tests are available at `/tests`

## Running everything together

* `pnpm start` - starts the addon, the tests, the docs app and the docs API

This will be used to update the changelog when GitHub releases a new version of the addon.

## Notes, Caveats, and Bugs

Until [this pnpm issue#4965](https://github.com/pnpm/pnpm/issues/4965) is fixed,
with the peer-dependency requirements of this repo, every time you re-build the addon,
you'll need to re-run `pnpm install` to re-create the links in the local `node_modules/.pnpm` store.
Thankfully, this is pretty fast.
