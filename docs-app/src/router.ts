import { registerDestructor } from '@ember/destroyable';
import EmberRouter from '@embroider/router';

import { properLinks } from 'ember-primitives/proper-links';
import config from '#config';
import { addRoutes } from 'kolay';

@properLinks({
  ignore: ['/tests'],
})
export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;

  constructor(...args: any[]) {
    super(...args);

    let scroll = () => window.scrollTo(0, 0);

    this.on('routeDidChange', scroll);
    registerDestructor(this, () => {
      this.off('routeDidChange', scroll);
    });
  }
}

Router.map(function () {
  addRoutes(this);
});
