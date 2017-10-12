import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';
import destroyApp from '../helpers/destroy-app';

var application;

module('Acceptance: Simple Table', {
  beforeEach: function() {
    application = startApp();
  },
  afterEach: function() {
    destroyApp(application);
  }
});

test('Check table pagination - 0 pages (.table-default)', function(assert) {
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

test('Check table pagination - 5 pages (.table-default)', function(assert) {
  server.createList('user', 50);
  visit('/');

  andThen(function() {
    assert.equal(currentPath(), 'index');

    assert.equal(find('.table-default table tbody tr').length, 10, 'Check for 10 items in table');
    assert.equal(find('.table-default .pagination > *').length, 7, 'Pagination is 5 pages');
  });
});

test('Check for expected content (.table-default)', function(assert) {
  server.loadFixtures('users');
  visit('/');

  andThen(function() {
    assert.equal(currentPath(), 'index');

    let cells = find('.table-default table tbody tr').eq(0).find('td');

    assert.equal(cells.eq(0).text().trim(), 'AnakinSkywalker9', 'Check for username');
    assert.equal(cells.eq(1).text().trim(), 'skywalker@domain.com', 'Check for email');
    assert.equal(cells.eq(2).text().trim(), '1082hudsasd', 'Check for password');
    assert.equal(cells.eq(3).text().trim(), 'Anakin', 'Check for first name');
    assert.equal(cells.eq(4).text().trim(), 'Skywalker', 'Check for last name');
    assert.equal(cells.eq(5).text().trim(), 'false', 'Check for is admin');
    assert.equal(cells.eq(6).text().trim(), 'Wed Jul 22 2009 00:00:00 GMT+0000', 'Check for created at');
    assert.equal(cells.eq(7).text().trim(), 'Thu Jul 23 2009 00:00:00 GMT+0000', 'Check for updated at');

    assert.equal(find('.table-default table tbody tr').length, 10, 'Check for 10 items in table');
  });
});

test('Check for expected content (.table-column-select)', function(assert) {
  server.loadFixtures('users');
  visit('/');

  andThen(function() {
    assert.equal(currentPath(), 'index');

    let cells = find('.table-column-select table tbody tr').eq(0).find('td');

    assert.equal(cells.eq(0).text().trim(), 'AnakinSkywalker9', 'Check for username');
    assert.equal(cells.eq(1).text().trim(), 'skywalker@domain.com', 'Check for email');
    assert.equal(cells.eq(2).text().trim(), 'Anakin', 'Check for first name');
    assert.equal(cells.eq(3).text().trim(), 'Skywalker', 'Check for last name');
    assert.equal(cells.eq(4).text().trim(), 'No', 'Check for is admin');
    assert.equal(cells.eq(5).text().trim(), '07/23/2009', 'Check for last updated');
    assert.equal(cells.eq(6).text().trim(), 'Edit', 'Check for edit link');

    assert.equal(find('.table-column-select table tbody tr').length, 10, 'Check for 10 items in table');
  });
});

test('Check for hidden column after interacting with column-select component (.table-column-select)', function(assert) {
  server.loadFixtures('users');
  visit('/');

  andThen(function() {
    assert.equal(currentPath(), 'index');

    let cells = find('.table-column-select table tbody tr').eq(0).find('td');

    assert.equal(find('.table-column-select table thead tr th').length, 7, 'Show expected number of <th> columns');
    assert.equal(cells.length, 7, 'Show expected number of <td> columns');
    assert.equal(cells.eq(0).text().trim(), 'AnakinSkywalker9', 'Check for username');
    assert.equal(cells.eq(1).text().trim(), 'skywalker@domain.com', 'Check for email');

    click('.table-column-select .btn-group-column-select button');
    click('.table-column-select .btn-group-column-select li:eq(0) a');
  });

  andThen(function() {
    let cells = find('.table-column-select table tbody tr').eq(0).find('td');

    assert.equal(find('.table-column-select table thead tr th').length, 6, 'Show expected number of <th> columns');
    assert.equal(cells.length, 6, 'Show expected number of <td> columns');
    assert.equal(cells.eq(0).text().trim(), 'skywalker@domain.com', 'Check for email, username is hidden');
    assert.equal(cells.eq(1).text().trim(), 'Anakin', 'Check for first name');

    click('.table-column-select .btn-group-column-select button');
    click('.table-column-select .btn-group-column-select li:eq(0) a');
  });
});

test('Check for expected content (.table-override-columns-template)', function(assert) {
  server.loadFixtures('users');
  visit('/');

  andThen(function() {
    assert.equal(currentPath(), 'index');

    let cells = find('.table-override-columns-template table tbody tr').eq(0).find('td');

    assert.equal(cells.eq(0).text().trim(), 'AnakinSkywalker9', 'Check for username');
    assert.equal(cells.eq(1).text().trim(), 'skywalker@domain.com', 'Check for email');
    assert.equal(cells.eq(2).text().trim(), 'Anakin', 'Check for first name');
    assert.equal(cells.eq(3).text().trim(), 'Skywalker', 'Check for last name');
    assert.equal(cells.eq(4).text().trim(), 'No', 'Check for is admin');
    assert.equal(cells.eq(5).text().trim(), '07/23/2009', 'Check for last updated');
    assert.equal(cells.eq(6).text().trim(), 'Edit', 'Check for edit link');

    assert.equal(find('.table-override-columns-template table tbody tr').length, 10, 'Check for 10 items in table');
  });
});

test('Check for proper row count when dropdown-limit is changed (.table-default)', function(assert) {
  server.createList('user', 50);
  visit('/');

  andThen(function() {
    assert.equal(currentPath(), 'index');

    let rows = find('.table-default table tbody tr');
    assert.equal(rows.length, 10, 'Check for 10 items in table');

    // change table limit to 25
    selectChoose($('.table-default .limit:eq(0)')[0], '25');

    andThen(function() {
      let rows = find('.table-default table tbody tr');
      assert.equal(rows.length, 25, 'Check for 25 items in table');
    });
  });
});

test('Check for dropdown-limit autoHide (.table-default)', function(assert) {
  server.createList('user', 10);
  visit('/');

  andThen(function() {
    assert.equal(currentPath(), 'index');

    let rows = find('.table-default table tbody tr');
    assert.equal(rows.length, 10, 'Check for 10 items in table');

    andThen(function() {
      assert.equal(find('.table-default .ember-tabular-dropdown-limit > *').length, 0, 'ember-tabular-dropdown-limit is hidden');
    });
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

test('Check table rendering for no data or loading (.table-default)', function(assert) {
  server.loadFixtures('users');
  visit('/');

  andThen(function() {
    assert.equal(currentPath(), 'index');
  });

  let store = application.__container__.lookup('service:store');
  andThen(function() {
    store.unloadAll('user');
  });

  andThen(function() {
    let cells = find('.table-default table tbody tr').eq(0).find('td');

    assert.equal(cells.eq(0).html().trim(), 'No Data.', 'No Data.');
  });
});

test('Check table rendering for pagination (.table-default)', function(assert) {
  server.loadFixtures('users');
  visit('/');

  andThen(function() {
    assert.equal(currentPath(), 'index');
    // Transition to the next page
    click('.table-default .pagination .next a');
  });

  andThen(function() {
    var cells = find('.table-default table tbody tr').eq(0).find('td');

    assert.equal(cells.eq(0).text().trim(), 'mcclane.jr', 'Check for username');
    assert.equal(cells.eq(1).text().trim(), 'jack.mcclane@domain.com', 'Check for email');
    assert.equal(cells.eq(2).text().trim(), 'h1d69sljq98', 'Check for password');
    assert.equal(cells.eq(3).text().trim(), 'Jack', 'Check for first name');
    assert.equal(cells.eq(4).text().trim(), 'McClane', 'Check for last name');
    assert.equal(cells.eq(5).text().trim(), 'false', 'Check for is admin');
    assert.equal(cells.eq(6).text().trim(), 'Sun Jan 01 2017 00:00:00 GMT+0000', 'Check for created at');
    assert.equal(cells.eq(7).text().trim(), 'Mon Jan 02 2017 00:00:00 GMT+0000', 'Check for updated at');

    assert.equal(find('.table-default table tbody tr').length, 2, 'Check for 2 items in table on second page');
  });
});

test('Check for expected content sorting (.table-default)', function(assert) {
  server.loadFixtures('users');
  visit('/');

  andThen(function() {
    assert.equal(currentPath(), 'index');

    click('.table-default table th:contains("Last Name") .btn-sort');
  });

  andThen(function() {
    let cells = find('.table-default table tbody tr').eq(0).find('td');

    assert.equal(cells.eq(0).text().trim(), 'Dooku', 'Check for username');
    assert.equal(cells.eq(1).text().trim(), 'count.dooku@domain.com', 'Check for email');
    assert.equal(cells.eq(2).text().trim(), '-912dh9ds', 'Check for password');
    assert.equal(cells.eq(3).text().trim(), 'Count', 'Check for first name');
    assert.equal(cells.eq(4).text().trim(), 'Dooku', 'Check for last name');
    assert.equal(cells.eq(5).text().trim(), 'false', 'Check for is admin');
    assert.equal(cells.eq(6).text().trim(), 'Sat Jul 22 2006 00:00:00 GMT+0000', 'Check for created at');
    assert.equal(cells.eq(7).text().trim(), 'Sun Jul 23 2006 00:00:00 GMT+0000', 'Check for updated at');

    assert.equal(find('.table-default table tbody tr').length, 10, 'Check for 10 items in table');
  });

  andThen(function() {
    let request = getPretenderRequest(server, 'GET', 'users')[0];

    assert.equal(request.status, 200);
    assert.equal(request.method, 'GET');
    assert.equal(request.url, '/users?page%5Blimit%5D=10&page%5Boffset%5D=0&sort=last-name', 'Expected query params in URL');
  });
});

test('Check for disabled sorting (.table-override-columns-template)', function(assert) {
  server.loadFixtures('users');
  visit('/');

  andThen(function() {
    assert.equal(currentPath(), 'index');

    click('.table-override-columns-template table th:contains("Last Updated")');
  });

  andThen(function() {
    let cells = find('.table-override-columns-template table tbody tr').eq(0).find('td');

    assert.equal(find('.table-override-columns-template #updated-at').hasClass('sortable'), false, 'Check for missing sortable class');

    assert.equal(cells.eq(0).text().trim(), 'AnakinSkywalker9', 'Check for username');
    assert.equal(cells.eq(1).text().trim(), 'skywalker@domain.com', 'Check for email');
    assert.equal(cells.eq(2).text().trim(), 'Anakin', 'Check for first name');
    assert.equal(cells.eq(3).text().trim(), 'Skywalker', 'Check for last name');
    assert.equal(cells.eq(5).text().trim(), '07/23/2009', 'Check for date');
    assert.equal(cells.eq(6).find('a').text().trim(), 'Edit', 'Check for actions');

    assert.equal(find('.table-override-columns-template table tbody tr').length, 10, 'Check for 10 items in table');
  });

  andThen(function() {
    let request = getPretenderRequest(server, 'GET', 'users')[4];

    assert.equal(request.status, 200);
    assert.equal(request.method, 'GET');
    assert.equal(request.url, '/users?page%5Blimit%5D=10&page%5Boffset%5D=0&sort=username', 'Expected query params in URL, no sort');
  });
});

test('Check for expected content filter (.table-default)', function(assert) {
  server.loadFixtures('users');
  visit('/');

  andThen(function() {
    assert.equal(currentPath(), 'index');

    click('.table-default table .btn-toggle-filter:eq(0)');
    fillIn('.table-default table thead tr:eq(1) th:eq(4) input', 'McClane');
    find('.table-default table thead tr:eq(1) th:eq(4) input').trigger('keyup');
  });

  andThen(function() {
    let cells = find('.table-default table tbody tr').eq(0).find('td');

    assert.equal(cells.eq(0).text().trim(), 'YippieKiYay', 'Check for username');
    assert.equal(cells.eq(1).text().trim(), 'john.mcclane@domain.com', 'Check for email');
    assert.equal(cells.eq(2).text().trim(), '12s2s2132x', 'Check for password');
    assert.equal(cells.eq(3).text().trim(), 'John', 'Check for first name');
    assert.equal(cells.eq(4).text().trim(), 'McClane', 'Check for last name');
    assert.equal(cells.eq(5).text().trim(), 'true', 'Check for is admin');
    assert.equal(cells.eq(6).text().trim(), 'Sun Jan 01 2017 00:00:00 GMT+0000', 'Check for created at');
    assert.equal(cells.eq(7).text().trim(), 'Mon Jan 02 2017 00:00:00 GMT+0000', 'Check for updated at');

    assert.equal(find('.table-default table tbody tr').length, 2, 'Check for 2 items in table');
  });

  andThen(function() {
    let request = getPretenderRequest(server, 'GET', 'users')[0];

    assert.equal(request.status, 200);
    assert.equal(request.method, 'GET');
    assert.equal(request.url, '/users?filter%5Blast-name%5D=McClane&page%5Blimit%5D=10&page%5Boffset%5D=0&sort=username', 'Expected query params in URL');
  });
});

test('Check for expected content multiple filters (.table-default)', function(assert) {
  server.loadFixtures('users');
  visit('/');

  andThen(function() {
    assert.equal(currentPath(), 'index');

    click('.table-default table .btn-toggle-filter:eq(0)');
    fillIn('.table-default table thead tr:eq(1) th:eq(3) input', 'John');
    find('.table-default table thead tr:eq(1) th:eq(3) input').trigger('keyup');
    fillIn('.table-default table thead tr:eq(1) th:eq(4) input', 'McClane');
    find('.table-default table thead tr:eq(1) th:eq(4) input').trigger('keyup');
  });

  andThen(function() {
    var cells = find('.table-default table tbody tr').eq(0).find('td');

    assert.equal(cells.eq(0).text().trim(), 'YippieKiYay', 'Check for username');
    assert.equal(cells.eq(1).text().trim(), 'john.mcclane@domain.com', 'Check for email');
    assert.equal(cells.eq(2).text().trim(), '12s2s2132x', 'Check for password');
    assert.equal(cells.eq(3).text().trim(), 'John', 'Check for first name');
    assert.equal(cells.eq(4).text().trim(), 'McClane', 'Check for last name');
    assert.equal(cells.eq(5).text().trim(), 'true', 'Check for is admin');
    assert.equal(cells.eq(6).text().trim(), 'Sun Jan 01 2017 00:00:00 GMT+0000', 'Check for created at');
    assert.equal(cells.eq(7).text().trim(), 'Mon Jan 02 2017 00:00:00 GMT+0000', 'Check for updated at');

    assert.equal(find('.table-default table tbody tr').length, 1, 'Check for 1 item in table');
  });

  andThen(function() {
    var request = getPretenderRequest(server, 'GET', 'users')[0];

    assert.equal(request.status, 200);
    assert.equal(request.method, 'GET');
    assert.equal(request.url, '/users?filter%5Bfirst-name%5D=John&filter%5Blast-name%5D=McClane&page%5Blimit%5D=10&page%5Boffset%5D=0&sort=username', 'Expected query params in URL');
  });
});

test('Check for expected content sort/filter (.table-default)', function(assert) {
  server.loadFixtures('users');
  visit('/');

  andThen(function() {
    assert.equal(currentPath(), 'index');

    click('.table-default table th:contains("Last Name") .btn-sort');
  });

  andThen(function() {
    click('.table-default table .btn-toggle-filter:eq(0)');
    fillIn('.table-default table thead tr:eq(1) th:eq(4) input', 'McClane');
    find('.table-default table thead tr:eq(1) th:eq(4) input').trigger('keyup');
  });

  andThen(function() {
    let cells = find('.table-default table tbody tr').eq(0).find('td');

    assert.equal(cells.eq(0).text().trim(), 'YippieKiYay', 'Check for username');
    assert.equal(cells.eq(1).text().trim(), 'john.mcclane@domain.com', 'Check for email');
    assert.equal(cells.eq(2).text().trim(), '12s2s2132x', 'Check for password');
    assert.equal(cells.eq(3).text().trim(), 'John', 'Check for first name');
    assert.equal(cells.eq(4).text().trim(), 'McClane', 'Check for last name');
    assert.equal(cells.eq(5).text().trim(), 'true', 'Check for is admin');
    assert.equal(cells.eq(6).text().trim(), 'Sun Jan 01 2017 00:00:00 GMT+0000', 'Check for created at');
    assert.equal(cells.eq(7).text().trim(), 'Mon Jan 02 2017 00:00:00 GMT+0000', 'Check for updated at');

    assert.equal(find('.table-default table tbody tr').length, 2, 'Check for 1 item in table');
  });

  andThen(function() {
    let request = getPretenderRequest(server, 'GET', 'users')[0];

    assert.equal(request.status, 200);
    assert.equal(request.method, 'GET');
    assert.equal(request.url, '/users?filter%5Blast-name%5D=McClane&page%5Blimit%5D=10&page%5Boffset%5D=0&sort=last-name', 'Expected query params in URL');
  });
});

test('Check for expected content dropdown filter (.table-override-columns-template)', function(assert) {
  server.loadFixtures('users');
  visit('/');

  andThen(function() {
    assert.equal(currentPath(), 'index');

    click('.table-override-columns-template table .btn-toggle-filter:eq(0)');
    selectChoose('.table-override-columns-template .ember-tabular-ember-power-select', 'Yes');
  });

  andThen(function() {
    var request = getPretenderRequest(server, 'GET', 'users')[0];

    assert.equal(request.status, 200);
    assert.equal(request.method, 'GET');
    assert.equal(request.url, '/users?filter%5Bis-admin%5D=true&page%5Blimit%5D=10&page%5Boffset%5D=0&sort=username', 'Expected query params in URL');
  });
});

test('Check for expected content dropdown filter (.table-column-select) (pass in array of values for dropdown into ember-tabular-column)', function(assert) {
  server.loadFixtures('users');
  visit('/');

  andThen(function() {
    assert.equal(currentPath(), 'index');

    click('.table-column-select table .btn-toggle-filter:eq(0)');
    selectChoose('.table-column-select .ember-tabular-ember-power-select', 'Yes');
  });

  andThen(function() {
    var request = getPretenderRequest(server, 'GET', 'users')[0];

    assert.equal(request.status, 200);
    assert.equal(request.method, 'GET');
    assert.equal(request.url, '/users?filter%5Bis-admin%5D=true&page%5Blimit%5D=10&page%5Boffset%5D=0&sort=username', 'Expected query params in URL');
  });
});

test('Check for dropdown clear success (.table-override-columns-template)', function(assert) {
  server.loadFixtures('users');
  visit('/');

  andThen(function() {
    assert.equal(currentPath(), 'index');

    click('.table-override-columns-template .btn-toggle-filter:eq(0)');
  });

  andThen(function() {
    selectChoose($('.table-override-columns-template .ember-tabular-ember-power-select:eq(0)')[0], 'Yes');
  });

  andThen(function() {
    var request = getPretenderRequest(server, 'GET', 'users')[0];

    assert.equal(request.url, '/users?filter%5Bis-admin%5D=true&page%5Blimit%5D=10&page%5Boffset%5D=0&sort=username', 'Expected query params in URL');
  });

  andThen(function() {
    click('.table-override-columns-template .ember-power-select-clear-btn:eq(0)');

    andThen(function() {
      var request = getPretenderRequest(server, 'GET', 'users')[0];

      assert.equal(request.url, '/users?page%5Blimit%5D=10&page%5Boffset%5D=0&sort=username', 'Expected query params in URL');
    });
  });
});

test('Check for expected content after filtering (.table-basic-global-filter)', function(assert) {
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

    assert.equal(cells.eq(0).text().trim(), 'YippieKiYay', 'Check for username');
    assert.equal(cells.eq(1).text().trim(), 'john.mcclane@domain.com', 'Check for email');
    assert.equal(cells.eq(2).text().trim(), 'John', 'Check for first name');
    assert.equal(cells.eq(3).text().trim(), 'McClane', 'Check for last name');
    assert.equal(cells.eq(4).text().trim(), 'true', 'Check for is admin');

    assert.equal(find('.table-basic-global-filter table tbody tr').length, 1, 'Check for 1 item in table');
  });

  andThen(function() {
    let request = getPretenderRequest(server, 'GET', 'users')[0];

    assert.equal(request.status, 200);
    assert.equal(request.method, 'GET');
    assert.equal(request.url, '/users?filter%5Busername%5D=YippieKiYay&page%5Blimit%5D=10&page%5Boffset%5D=0&sort=', 'Expected query params in URL');
  });
});

test('Check for clearFilter action success (.table-default)', function(assert) {
  server.loadFixtures('users');
  visit('/');

  andThen(function() {
    assert.equal(currentPath(), 'index');
  });

  andThen(function() {
    click('.table-default table .btn-toggle-filter:eq(0)');
    fillIn('.table-default table thead tr:eq(1) th:eq(4) input', 'McClane');
    find('.table-default table thead tr:eq(1) th:eq(4) input').trigger('keyup');
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

test('Check for clearFilter action success (.table-basic-global-filter )', function(assert) {
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

test('Check to filter by date and is-admin (.table-basic-global-date-filter)', function(assert) {
  server.loadFixtures('users');
  visit('/');

  andThen(function() {
    assert.equal(currentPath(), 'index');
  });

  andThen(function() {
    selectChoose($('.table-basic-global-date-filter .ember-tabular-ember-power-select:eq(0)')[0], 'Yes');

    fillIn('.table-basic-global-date-filter .table-filter input:eq(0)', '2017-01-02');
    find('.table-basic-global-date-filter .table-filter input:eq(0)').trigger('keyup');
  });

  andThen(function() {
    assert.equal(find('.table-basic-global-date-filter table tbody tr').length, 1, 'Check for 1 item in table');

    let request = getPretenderRequest(server, 'GET', 'users')[0];

    assert.equal(request.status, 200);
    assert.equal(request.method, 'GET');
    assert.equal(request.url, '/users?filter%5Bis-admin%5D=true&filter%5Bupdated-at%5D=2017-01-02&page%5Blimit%5D=10&page%5Boffset%5D=0&sort=', 'Expected query params in URL');
  });
});

test('Check for infinite request loop (.table-basic-global-date-filter)', function(assert) {
  // error occurs if controller properties that are shared
  // with ember-tabular components are not defined within controller
  server.loadFixtures('users');
  visit('/');

  andThen(function() {
    assert.equal(currentPath(), 'index');
  });

  andThen(function() {
    // only trigger date
    fillIn('.table-basic-global-date-filter .table-filter input:eq(0)', '2017-01-02');
    find('.table-basic-global-date-filter .table-filter input:eq(0)').trigger('keyup');
  });

  andThen(function() {
    let request = getPretenderRequest(server, 'GET', 'users')[0];

    assert.equal(request.url, '/users?filter%5Bupdated-at%5D=2017-01-02&page%5Blimit%5D=10&page%5Boffset%5D=0&sort=', 'Expected query params in URL');

    Ember.run.later(function() {
      var requests = getPretenderRequest(server, 'GET');
      assert.equal(requests.reduce(function(n, request) {return n + (request.url === '/users?filter%5Bupdated-at%5D=2017-01-02&page%5Blimit%5D=10&page%5Boffset%5D=0&sort=');}, 0), 1, '1 GET request to /users are occurring');
    }, 1000);
  });
});

test('Check for date clearFilter action success (.table-basic-global-date-filter)', function(assert) {
  server.loadFixtures('users');
  visit('/');

  andThen(function() {
    assert.equal(currentPath(), 'index');
  });

  andThen(function() {
    fillIn('.table-basic-global-date-filter .table-filter input:eq(0)', '2017-01-02');
    find('.table-basic-global-date-filter .table-filter input:eq(0)').trigger('keyup');
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

test('Check for persistent filters on transition (.table-persist)', function(assert) {
  server.loadFixtures('users');
  visit('/');

  andThen(function() {
    assert.equal(currentPath(), 'index');
  });

  andThen(function() {
    assert.equal(find('.table-persist table tbody tr').length, 10, 'Check for 10 item in table');
  });

  andThen(function() {
    click('.table-persist table .btn-toggle-filter:eq(0)');
    fillIn('.table-persist table thead tr:eq(1) th:eq(3) input', 'McClane');
    find('.table-persist table thead tr:eq(1) th:eq(3) input').trigger('keyup');
  });

  andThen(function() {
    assert.equal(find('.table-persist table tbody tr').length, 2, 'Check for 2 item in table');
  });

  andThen(function() {
    // transition to different page
    click('.link-ex4');
  });

  andThen(function() {
    // transition back to index
    click('.link-index');
  });

  andThen(function() {
    assert.equal(find('.table-persist table tbody tr').length, 2, 'Check for 2 item in table');

    click('.table-persist table .btn-toggle-filter:eq(0)');
    andThen(function() {
      assert.equal(find('.table-persist table thead tr:eq(1) th:eq(3) input').val(), 'McClane', 'Check for populated filter on transition');
    });

    andThen(function() {
      let request = getPretenderRequest(server, 'GET', 'users');

      assert.equal(request.length, 16, 'Check that additional request was not made when opening filter row');
    });
  });
});

test('Check for expected request count when transitioning', function(assert) {
  server.loadFixtures('users');
  visit('/');

  andThen(function() {
    assert.equal(currentPath(), 'index');

    // transition user to other page
    click('.link-ex4');
  });

  andThen(function() {
    let request = getPretenderRequest(server, 'GET', 'users');

    assert.equal(request.length, 8, 'Should only see 8 requests, checking to ensure extra requests are not made on transition');
  });
});

test('Check for expected content (.table-select-row)', function(assert) {
  server.loadFixtures('users');
  visit('/');

  andThen(function() {
    assert.equal(currentPath(), 'index');

    let cells = find('.table-select-row table tbody tr').eq(0).find('td');

    assert.equal(cells.eq(0).find('input').prop('checked'), false, 'Check for checkbox');
    assert.equal(cells.eq(1).text().trim(), 'AnakinSkywalker9', 'Check for username');
    assert.equal(cells.eq(2).text().trim(), 'skywalker@domain.com', 'Check for email');
    assert.equal(cells.eq(3).text().trim(), '1082hudsasd', 'Check for password');
    assert.equal(cells.eq(4).text().trim(), 'Anakin', 'Check for first name');
    assert.equal(cells.eq(5).text().trim(), 'Skywalker', 'Check for last name');
    assert.equal(cells.eq(6).text().trim(), 'false', 'Check for is admin');
    assert.equal(cells.eq(7).text().trim(), 'Wed Jul 22 2009 00:00:00 GMT+0000', 'Check for created at');
    assert.equal(cells.eq(8).text().trim(), 'Thu Jul 23 2009 00:00:00 GMT+0000', 'Check for updated at');

    assert.equal(find('.table-select-row table tbody tr').length, 10, 'Check for 10 items in table');
  });
});

test('Check for checking all rows (.table-select-row)', function(assert) {
  server.loadFixtures('users');
  visit('/');

  andThen(function() {
    assert.equal(currentPath(), 'index');

    click('.table-select-row .allChecked');
  });

  andThen(function() {
    let rows = find('.table-select-row table tbody tr');

    assert.equal(rows.eq(0).find('td:eq(0) input').prop('checked'), true, 'Check for checked checkbox');
    assert.equal(rows.eq(1).find('td:eq(0) input').prop('checked'), true, 'Check for checked checkbox');
    assert.equal(rows.eq(2).find('td:eq(0) input').prop('checked'), true, 'Check for checked checkbox');

    click('.table-select-row .allChecked');
  });

  andThen(function() {
    let rows = find('.table-select-row table tbody tr');

    assert.equal(rows.eq(0).find('td:eq(0) input').prop('checked'), false, 'Check for unchecked checkbox');
    assert.equal(rows.eq(1).find('td:eq(0) input').prop('checked'), false, 'Check for unchecked checkbox');
    assert.equal(rows.eq(2).find('td:eq(0) input').prop('checked'), false, 'Check for unchecked checkbox');
  });
});

test('Check for checking rows using shift + click (.table-select-row)', function(assert) {
  server.loadFixtures('users');
  visit('/');

  andThen(function() {
    assert.equal(currentPath(), 'index');

    let rows = find('.table-select-row table tbody tr');

    // select the second row through the 5th
    click(find(rows.eq(1).find('td:eq(0) input[type="checkbox"]:eq(0)')));
    triggerEvent(find(rows.eq(4).find('td:eq(0) input[type="checkbox"]:eq(0)')), 'click', {
        shiftKey: true,
    });

    andThen(function () {
      assert.equal(rows.eq(0).find('td:eq(0) input').prop('checked'), false, 'Check for unchecked checkbox');
      assert.equal(rows.eq(1).find('td:eq(0) input').prop('checked'), true, 'Check for checked checkbox');
      assert.equal(rows.eq(2).find('td:eq(0) input').prop('checked'), true, 'Check for checked checkbox');
      assert.equal(rows.eq(3).find('td:eq(0) input').prop('checked'), true, 'Check for checked checkbox');
      assert.equal(rows.eq(4).find('td:eq(0) input').prop('checked'), true, 'Check for checked checkbox');
      assert.equal(rows.eq(5).find('td:eq(0) input').prop('checked'), false, 'Check for unchecked checkbox');
    });
  });
});
