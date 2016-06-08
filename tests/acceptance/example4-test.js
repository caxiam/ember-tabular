import moduleForAcceptance from '../helpers/module-for-acceptance';
import { test } from 'qunit';

moduleForAcceptance('Acceptance: Example4 Table', {
  integration: true,
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
    assert.equal(request.url, '/users?limit=10&offset=0&page=1&sort=username', 'Expected query params in URL');
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
