import moduleForAcceptance from '../helpers/module-for-acceptance';
import { test } from 'qunit';

moduleForAcceptance('Acceptance: Simple Table', {
  integration: true,
});

test('Check table pagination - 0 pages', function(assert) {
  server.createList('user', 0);
  visit('/');

  andThen(function() {
    assert.equal(currentPath(), 'index');

    let cells = find('.table-default table tbody tr').eq(0).find('td');

    assert.equal(find('.table-default table tbody tr').length, 1, 'Check for 1 items in table');
    assert.equal(cells.eq(0).html().trim(), 'No Data.', 'No Data.');
    assert.equal(find('.table-default .pagination').hasClass('hidden'), true, 'Pagination is hidden');
  });
});

test('Check table pagination - 5 pages', function(assert) {
  server.createList('user', 50);
  visit('/');

  andThen(function() {
    assert.equal(currentPath(), 'index');

    assert.equal(find('.table-default table tbody tr').length, 10, 'Check for 10 items in table');
    assert.equal(find('.table-default .pagination > *').length, 7, 'Pagination is 5 pages');
  });
});

test('Check for expected content', function(assert) {
  server.loadFixtures('users');
  visit('/');

  andThen(function() {
    assert.equal(currentPath(), 'index');

    let cells = find('.table-default table tbody tr').eq(0).find('td');

    assert.equal(cells.eq(0).html(), 'AnakinSkywalker9', 'Check for username');
    assert.equal(cells.eq(1).html(), 'skywalker@domain.com', 'Check for email');
    assert.equal(cells.eq(2).html(), 'Anakin', 'Check for first name');
    assert.equal(cells.eq(3).html(), 'Skywalker', 'Check for last name');
    assert.equal(cells.eq(4).text().trim(), '07/23/2009', 'Check for date');
    assert.equal(cells.eq(5).find('a').text().trim(), 'Edit', 'Check for actions');

    assert.equal(find('.table-default table tbody tr').length, 10, 'Check for 10 items in table');
  });
});

test('Check for error handling', function(assert) {
  server.get('/users',
    {
      errors: [
        {
          'status': '400',
          'title':  'Bad Request',
          'detail': 'Error returning users'
        }
      ]
    },
    400
  );
  visit('/');

  andThen(function() {
    assert.equal(currentPath(), 'index');

    assertIn(assert, find('.alert').text(), 'Error', 'Check for general error message.');
  });
});

test('Check table rendering for no data or loading', function(assert) {
  server.loadFixtures('users');
  visit('/');

  andThen(function() {
    assert.equal(currentPath(), 'index');
  });

  let store = this.application.__container__.lookup('service:store');
  andThen(function() {
    store.unloadAll('user');
  });

  andThen(function() {
    let cells = find('.table-default table tbody tr').eq(0).find('td');

    assert.equal(cells.eq(0).html().trim(), 'No Data.', 'No Data.');
  });
});

test('Check table rendering for pagination', function(assert) {
  server.loadFixtures('users');
  visit('/');

  andThen(function() {
    assert.equal(currentPath(), 'index');
    // Transition to the next page
    click('.table-default .pagination .next a');
  });

  andThen(function() {
    let cells = find('.table-default table tbody tr').eq(0).find('td');

    assert.equal(cells.eq(0).html(), 'mcclane.jr', 'Check for username');
    assert.equal(cells.eq(1).html(), 'jack.mcclane@domain.com', 'Check for email');
    assert.equal(cells.eq(2).html(), 'Jack', 'Check for first name');
    assert.equal(cells.eq(3).html(), 'McClane', 'Check for last name');
    assert.equal(cells.eq(4).text().trim(), '01/02/2017', 'Check for date');
    assert.equal(cells.eq(5).find('a').text().trim(), 'Edit', 'Check for actions');

    assert.equal(find('.table-default table tbody tr').length, 2, 'Check for 2 items in table on second page');
  });
});

test('Check for expected content sorting', function(assert) {
  server.loadFixtures('users');
  visit('/');

  andThen(function() {
    assert.equal(currentPath(), 'index');

    click('table th:contains("Last Name") .btn-sort');
  });

  andThen(function() {
    let cells = find('.table-default table tbody tr').eq(0).find('td');

    assert.equal(cells.eq(0).html(), 'Dooku', 'Check for username');
    assert.equal(cells.eq(1).html(), 'count.dooku@domain.com', 'Check for email');
    assert.equal(cells.eq(2).html(), 'Count', 'Check for first name');
    assert.equal(cells.eq(3).html(), 'Dooku', 'Check for last name');
    assert.equal(cells.eq(4).text().trim(), '07/23/2006', 'Check for date');
    assert.equal(cells.eq(5).find('a').text().trim(), 'Edit', 'Check for actions');

    assert.equal(find('.table-default table tbody tr').length, 10, 'Check for 10 items in table');
  });

  andThen(function() {
    let request = getPretenderRequest(server, 'GET', 'users')[0];

    assert.equal(request.status, 200);
    assert.equal(request.method, 'GET');
    assert.equal(request.url, '/users?page%5Blimit%5D=10&page%5Boffset%5D=0&sort=last-name', 'Expected query params in URL');
  });
});

test('Check for disabled sorting', function(assert) {
  server.loadFixtures('users');
  visit('/');

  andThen(function() {
    assert.equal(currentPath(), 'index');

    click('.table-default table th:contains("Last Updated")');
  });

  andThen(function() {
    let cells = find('.table-default table tbody tr').eq(0).find('td');

    assert.equal(find('.table-default #updated-at').hasClass('sortable'), false, 'Check for missing sortable class');

    assert.equal(cells.eq(0).html(), 'AnakinSkywalker9', 'Check for username');
    assert.equal(cells.eq(1).html(), 'skywalker@domain.com', 'Check for email');
    assert.equal(cells.eq(2).html(), 'Anakin', 'Check for first name');
    assert.equal(cells.eq(3).html(), 'Skywalker', 'Check for last name');
    assert.equal(cells.eq(4).text().trim(), '07/23/2009', 'Check for date');
    assert.equal(cells.eq(5).find('a').text().trim(), 'Edit', 'Check for actions');

    assert.equal(find('.table-default table tbody tr').length, 10, 'Check for 10 items in table');
  });

  andThen(function() {
    let request = getPretenderRequest(server, 'GET', 'users')[0];

    assert.equal(request.status, 200);
    assert.equal(request.method, 'GET');
    assert.equal(request.url, '/users?page%5Blimit%5D=10&page%5Boffset%5D=0&sort=', 'Expected query params in URL, no sort');
  });
});

test('Check for expected content filter', function(assert) {
  server.loadFixtures('users');
  visit('/');

  andThen(function() {
    assert.equal(currentPath(), 'index');

    click('.table-default table .btn-toggle-filter:eq(0)');
    fillIn('.table-default table thead tr:eq(1) th:eq(3) input', 'McClane');
    find('.table-default table thead tr:eq(1) th:eq(3) input').trigger('keyup');
  });

  andThen(function() {
    let cells = find('.table-default table tbody tr').eq(0).find('td');

    assert.equal(cells.eq(0).html(), 'YippieKiYay', 'Check for username');
    assert.equal(cells.eq(1).html(), 'john.mcclane@domain.com', 'Check for email');
    assert.equal(cells.eq(2).html(), 'John', 'Check for first name');
    assert.equal(cells.eq(3).html(), 'McClane', 'Check for last name');
    assert.equal(cells.eq(4).text().trim(), '01/02/2017', 'Check for date');
    assert.equal(cells.eq(5).find('a').text().trim(), 'Edit', 'Check for actions');

    assert.equal(find('.table-default table tbody tr').length, 2, 'Check for 2 items in table');
  });

  andThen(function() {
    let request = getPretenderRequest(server, 'GET', 'users')[0];

    assert.equal(request.status, 200);
    assert.equal(request.method, 'GET');
    assert.equal(request.url, '/users?filter%5Blast-name%5D=McClane&page%5Blimit%5D=10&page%5Boffset%5D=0&sort=username', 'Expected query params in URL');
  });
});

test('Check for expected content multiple filters', function(assert) {
  server.loadFixtures('users');
  visit('/');

  andThen(function() {
    assert.equal(currentPath(), 'index');

    click('.table-default table .btn-toggle-filter:eq(0)');
    fillIn('.table-default table thead tr:eq(1) th:eq(2) input', 'John');
    find('.table-default table thead tr:eq(1) th:eq(2) input').trigger('keyup');
    fillIn('.table-default table thead tr:eq(1) th:eq(3) input', 'McClane');
    find('.table-default table thead tr:eq(1) th:eq(3) input').trigger('keyup');
  });

  andThen(function() {
    let cells = find('.table-default table tbody tr').eq(0).find('td');

    assert.equal(cells.eq(0).html(), 'YippieKiYay', 'Check for username');
    assert.equal(cells.eq(1).html(), 'john.mcclane@domain.com', 'Check for email');
    assert.equal(cells.eq(2).html(), 'John', 'Check for first name');
    assert.equal(cells.eq(3).html(), 'McClane', 'Check for last name');
    assert.equal(cells.eq(4).text().trim(), '01/02/2017', 'Check for date');
    assert.equal(cells.eq(5).find('a').text().trim(), 'Edit', 'Check for actions');

    assert.equal(find('.table-default table tbody tr').length, 1, 'Check for 1 item in table');
  });

  andThen(function() {
    let request = getPretenderRequest(server, 'GET', 'users')[0];

    assert.equal(request.status, 200);
    assert.equal(request.method, 'GET');
    assert.equal(request.url, '/users?filter%5Bfirst-name%5D=John&filter%5Blast-name%5D=McClane&page%5Blimit%5D=10&page%5Boffset%5D=0&sort=username', 'Expected query params in URL');
  });
});

test('Check for expected content sort/filter', function(assert) {
  server.loadFixtures('users');
  visit('/');

  andThen(function() {
    assert.equal(currentPath(), 'index');

    click('.table-default table th:contains("Last Name") .btn-sort');
  });

  andThen(function() {
    click('.table-default table .btn-toggle-filter:eq(0)');
    fillIn('.table-default table thead tr:eq(1) th:eq(3) input', 'McClane');
    find('.table-default table thead tr:eq(1) th:eq(3) input').trigger('keyup');
  });

  andThen(function() {
    let cells = find('.table-default table tbody tr').eq(0).find('td');

    assert.equal(cells.eq(0).html(), 'YippieKiYay', 'Check for username');
    assert.equal(cells.eq(1).html(), 'john.mcclane@domain.com', 'Check for email');
    assert.equal(cells.eq(2).html(), 'John', 'Check for first name');
    assert.equal(cells.eq(3).html(), 'McClane', 'Check for last name');
    assert.equal(cells.eq(4).text().trim(), '01/02/2017', 'Check for date');
    assert.equal(cells.eq(5).find('a').text().trim(), 'Edit', 'Check for actions');

    assert.equal(find('.table-default table tbody tr').length, 2, 'Check for 1 item in table');
  });

  andThen(function() {
    let request = getPretenderRequest(server, 'GET', 'users')[0];

    assert.equal(request.status, 200);
    assert.equal(request.method, 'GET');
    assert.equal(request.url, '/users?filter%5Blast-name%5D=McClane&page%5Blimit%5D=10&page%5Boffset%5D=0&sort=last-name', 'Expected query params in URL');
  });
});

test('Check table-basic-global-filter for expected content after filtering', function(assert) {
  server.loadFixtures('users');
  visit('/');

  andThen(function() {
    assert.equal(currentPath(), 'index');
  });

  andThen(function() {
    fillIn('.table-basic-global-filter .table-filter input', 'YippieKiYay');
    find('.table-basic-global-filter .table-filter input').trigger('keyup');
  });

  andThen(function() {
    let cells = find('.table-basic-global-filter table tbody tr').eq(0).find('td');

    assert.equal(cells.eq(0).html(), 'YippieKiYay', 'Check for username');
    assert.equal(cells.eq(1).html(), 'john.mcclane@domain.com', 'Check for email');
    assert.equal(cells.eq(2).html(), 'John', 'Check for first name');
    assert.equal(cells.eq(3).html(), 'McClane', 'Check for last name');
    assert.equal(cells.eq(4).text().trim(), '01/02/2017', 'Check for date');

    assert.equal(find('.table-basic-global-filter table tbody tr').length, 1, 'Check for 1 item in table');
  });

  andThen(function() {
    let request = getPretenderRequest(server, 'GET', 'users')[0];

    assert.equal(request.status, 200);
    assert.equal(request.method, 'GET');
    assert.equal(request.url, '/users?filter%5Busername%5D=YippieKiYay&page%5Blimit%5D=10&page%5Boffset%5D=0&sort=', 'Expected query params in URL');
  });
});

test('Check for clearFilter action success', function(assert) {
  server.loadFixtures('users');
  visit('/');

  andThen(function() {
    assert.equal(currentPath(), 'index');
  });

  andThen(function() {
    click('.table-default table .btn-toggle-filter:eq(0)');
    fillIn('.table-default table thead tr:eq(1) th:eq(3) input', 'McClane');
    find('.table-default table thead tr:eq(1) th:eq(3) input').trigger('keyup');
  });

  andThen(function() {
    assert.equal(find('.table-default table tbody tr').length, 2, 'Check for 2 item in table');
  });

  andThen(function() {
    click('.table-default table .clearFilter');
  });

  andThen(function() {
    assert.equal(find('.table-default table tbody tr').length, 10, 'Check for 10 item in table');
  });
});

test('Check table-basic-global-filter for clearFilter action success', function(assert) {
  server.loadFixtures('users');
  visit('/');

  andThen(function() {
    assert.equal(currentPath(), 'index');
  });

  andThen(function() {
    fillIn('.table-basic-global-filter .table-filter input', 'YippieKiYay');
    find('.table-basic-global-filter .table-filter input').trigger('keyup');
  });

  andThen(function() {
    assert.equal(find('.table-basic-global-filter table tbody tr').length, 1, 'Check for 1 item in table');
  });

  andThen(function() {
    click('.table-basic-global-filter .clearFilter');
  });

  andThen(function() {
    assert.equal(find('.table-basic-global-filter table tbody tr').length, 10, 'Check for 10 item in table');
  });
});

test('Check table-basic-global-date-filter to filter by date and username', function(assert) {
  server.loadFixtures('users');
  visit('/');

  andThen(function() {
    assert.equal(currentPath(), 'index');
  });

  andThen(function() {
    fillIn('.table-basic-global-date-filter .table-filter input:eq(0)', 'YippieKiYay');
    find('.table-basic-global-date-filter .table-filter input:eq(0)').trigger('keyup');

    fillIn('.table-basic-global-date-filter .table-filter input:eq(1)', '2017-01-02');
    find('.table-basic-global-date-filter .table-filter input:eq(1)').trigger('keyup');
  });

  andThen(function() {
    assert.equal(find('.table-basic-global-date-filter table tbody tr').length, 1, 'Check for 1 item in table');

    let request = getPretenderRequest(server, 'GET', 'users')[0];

    assert.equal(request.status, 200);
    assert.equal(request.method, 'GET');
    assert.equal(request.url, '/users?filter%5Busername%5D=YippieKiYay&filter%5Bupdated-at%5D=2017-01-02&page%5Blimit%5D=10&page%5Boffset%5D=0&sort=', 'Expected query params in URL');
  });
});

test('Check table-basic-global-date-filter for date clearFilter action success', function(assert) {
  server.loadFixtures('users');
  visit('/');

  andThen(function() {
    assert.equal(currentPath(), 'index');
  });

  andThen(function() {
    fillIn('.table-basic-global-date-filter .table-filter input:eq(1)', '2017-01-02');
    find('.table-basic-global-date-filter .table-filter input:eq(1)').trigger('keyup');
  });

  andThen(function() {
    assert.equal(find('.table-basic-global-date-filter table tbody tr').length, 2, 'Check for 2 items in table');
  });

  andThen(function() {
    click('.table-basic-global-date-filter .clearFilter');
  });

  andThen(function() {
    assert.equal(find('.table-basic-global-date-filter table tbody tr').length, 10, 'Check for 10 item in table');
  });
});
