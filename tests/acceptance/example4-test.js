import { click, findAll, currentURL, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';
import destroyApp from '../helpers/destroy-app';

var application;

module('Acceptance: Example4 Table', function(hooks) {
  hooks.beforeEach(function() {
    application = startApp();
  });

  hooks.afterEach(function() {
    destroyApp(application);
  });

  test('Check for expected content (.table-basic-route-model)', async function(assert) {
    server.loadFixtures('users');
    await visit('/example4');

    assert.equal(currentURL(), '/example4');
    assert.equal(findAll('.table-basic-route-model table tbody tr').length, 10, 'Check for 10 items in table');

    let request = getPretenderRequest(server, 'GET', 'users')[0];

    assert.equal(request.status, 200);
    assert.equal(request.method, 'GET');
    assert.equal(request.url, '/users?page%5Blimit%5D=10&page%5Boffset%5D=0&sort=username', 'Expected query params in URL');
  });

  test('Check pagination - 5 pages (.table-basic-route-model)', async function(assert) {
    server.createList('user', 50);
    await visit('/example4');

    assert.equal(currentURL(), '/example4');

    assert.equal(findAll('.table-basic-route-model table tbody tr').length, 10, 'Check for 10 items in table');
    assert.equal(findAll('.table-basic-route-model .pagination > *').length, 7, 'Pagination is 5 pages');
  });

  test('Check ability to sort (.table-basic-route-model)', async function(assert) {
    server.createList('user', 50);
    await visit('/example4');

    assert.equal(currentURL(), '/example4');

    await click('table th:contains("Last Name") .btn-sort');
    assert.equal(findAll('.table-basic-route-model table tbody tr').length, 10, 'Check for 10 items in table');
    assert.equal(findAll('.table-basic-route-model .pagination > *').length, 7, 'Pagination is 5 pages');

    let request = getPretenderRequest(server, 'GET', 'users')[0];

    assert.equal(request.status, 200);
    assert.equal(request.method, 'GET');
    assert.equal(request.url, '/users?page%5Blimit%5D=10&page%5Boffset%5D=0&sort=last-name', 'Expected query params in URL');
  });
});
