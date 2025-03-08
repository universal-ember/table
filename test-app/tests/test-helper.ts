import {
  currentURL,
  getSettledState,
  resetOnerror,
  setApplication,
} from '@ember/test-helpers';
import { getPendingWaiterState } from '@ember/test-waiters';
import * as QUnit from 'qunit';
import { setup } from 'qunit-dom';
import { start as qunitStart, setupEmberOnerrorValidation } from 'ember-qunit';

import Application from '#src/app';
import config from '#config';

// Prevent tests from re-ordering on refresh
// (use seed query param to deliberately re-order)
QUnit.config.reorder = false;

// easy access debugging tools during a paused or stuck test
Object.assign(window, { getSettledState, currentURL, getPendingWaiterState });

QUnit.testDone(() => {
  resetOnerror();
});

export function start() {
  enterTestMode();
  setApplication(Application.create(config.APP));
  setup(QUnit.assert);
  setupEmberOnerrorValidation();
  qunitStart();
}
