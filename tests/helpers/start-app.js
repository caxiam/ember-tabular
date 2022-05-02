import { run } from '@ember/runloop';
import { merge } from '@ember/polyfills';
import Application from '../../app';
import config from '../../config/environment';
import util from './util';
import registerPowerSelectHelpers from 'ember-power-select/test-support/helpers';
import registerBasicDropdownHelpers from 'ember-basic-dropdown/test-support/helpers';

// Initialize helpers
util();
registerPowerSelectHelpers();
registerBasicDropdownHelpers();

export default function startApp(attrs) {
  let attributes = merge({}, config.APP);
  attributes.autoboot = true;
  attributes = merge(attributes, attrs); // use defaults, but you can override;

  return run(() => {
    let application = Application.create(attributes);
    application.setupForTesting();
    application.injectTestHelpers();
    return application;
  });
}
