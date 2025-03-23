import 'ember-primitives/styles.css';
import './styles/app.css';

import { sync } from 'ember-primitives/color-scheme';
import { install } from './icons';

import Application from '@ember/application';

import config from '#config';
import Resolver from 'ember-resolver';

import { registry } from './registry.ts';

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  Resolver = Resolver.withModules(registry);
}

sync();
install();

// @babel/traverse (from babel-plugin-ember-template-imports)
// accesses process.....
// maybe one day we can have a browser-only version?
// But they aren't used.... so.. that's fun.
Object.assign(window, {
  process: { env: {} },
  Buffer: {},
});
