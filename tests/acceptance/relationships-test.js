import { click, fillIn, currentURL, find, findAll, visit } from '@ember/test-helpers';
import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';
import destroyApp from '../helpers/destroy-app';

var application;

module('Acceptance: Relationships Tests', function(hooks) {
  hooks.beforeEach(function() {
    application = startApp();
  });

  hooks.afterEach(function() {
    destroyApp(application);
  });

  test('Check for expected url when filtering relationships', async function(assert) {
    server.loadFixtures('users');
    await visit('/');

    assert.equal(currentURL(), '/');

    // Override first table column.property to be relationship
    var controller = application.__container__.lookup('controller:index');
    Ember.set(controller.columns[0], 'property', 'account.username');
    await click(find('.table-override-columns-template table .btn-toggle-filter'));
    await fillIn('.table-override-columns-template table thead tr:eq(1) th:eq(0) input', 'Testing');
    find('.table-override-columns-template table thead tr:eq(1) th:eq(0) input').trigger('keyup');
    var request = getLastPretenderRequest(server);

    assert.equal(request.status, 200);
    assert.equal(request.method, 'GET');
    assert.equal(request.url, '/users?filter%5Baccount.username%5D=Testing&page%5Blimit%5D=10&page%5Boffset%5D=0&sort=username', 'URL has relationship in dot notation');
    // clear filter
    await click('.table-override-columns-template table .clearFilter');
    // make another request to the relationship
    await fillIn('.table-override-columns-template table thead tr:eq(1) th:eq(0) input', 'Testing2');
    find('.table-override-columns-template table thead tr:eq(1) th:eq(0) input').trigger('keyup');
    var request = getLastPretenderRequest(server);

    assert.equal(request.status, 200);
    assert.equal(request.method, 'GET');
    assert.equal(request.url, '/users?filter%5Baccount.username%5D=Testing2&page%5Blimit%5D=10&page%5Boffset%5D=0&sort=username', 'URL has retained dot notation');
  });
});
