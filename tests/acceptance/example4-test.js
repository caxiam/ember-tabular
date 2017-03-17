import { module, test } from 'qunit';
import startApp from '../helpers/start-app';
import destroyApp from '../helpers/destroy-app';

var application;

module('Acceptance: Example4 Table', {
  beforeEach: function() {
    application = startApp();
  },
  afterEach: function() {
    destroyApp(application);
  }
});

test('Check table-basic-route-model for expected content', function(assert) {
  server.loadFixtures('users');
  visit('/example4');

  andThen(function() {
    assert.equal(currentPath(), 'example4');
    assert.equal(find('.table-basic-route-model table tbody tr').length, 10, 'Check for 10 items in table');

    let request = getPretenderRequest(server, 'GET', 'users')[0];

    assert.equal(request.status, 200);
    assert.equal(request.method, 'GET');
    assert.equal(request.url, '/users?page%5Blimit%5D=10&page%5Boffset%5D=0&sort=username', 'Expected query params in URL');
  });
});

test('Check table-basic-route-model pagination - 5 pages', function(assert) {
  server.createList('user', 50);
  visit('/example4');

  andThen(function() {
    assert.equal(currentPath(), 'example4');

    assert.equal(find('.table-basic-route-model table tbody tr').length, 10, 'Check for 10 items in table');
    assert.equal(find('.table-basic-route-model .pagination > *').length, 7, 'Pagination is 5 pages');
  });
});

test('Check table-basic-route-model ability to sort', function(assert) {
  server.createList('user', 50);
  visit('/example4');

  andThen(function() {
    assert.equal(currentPath(), 'example4');

    click('table th:contains("Last Name") .btn-sort');
  });

  andThen(function() {
    assert.equal(find('.table-basic-route-model table tbody tr').length, 10, 'Check for 10 items in table');
    assert.equal(find('.table-basic-route-model .pagination > *').length, 7, 'Pagination is 5 pages');

    let request = getPretenderRequest(server, 'GET', 'users')[0];

    assert.equal(request.status, 200);
    assert.equal(request.method, 'GET');
    assert.equal(request.url, '/users?page%5Blimit%5D=10&page%5Boffset%5D=0&sort=last-name', 'Expected query params in URL');
  });
});
