import Application from '@ember/application';

import config from '#config';
import Resolver from 'ember-resolver';

import { registry } from './registry.ts';

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  Resolver = Resolver.withModules(registry);
}
