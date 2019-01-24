import { click, fillIn, find, findAll, currentURL, triggerEvent, visit } from '@ember/test-helpers';
import Ember from 'ember';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

var application;

module('Acceptance: Simple Table', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('Check table pagination - 0 pages (.table-default)', async function(assert) {
    server.createList('user', 0);
    await visit('/');

    assert.equal(currentURL(), '/');

    let cells = find('.table-default table tbody tr').eq(0).find('td');

    assert.equal(findAll('.table-default table tbody tr').length, 1, 'Check for 1 items in table');
    assertIn(assert, cells.eq(0).html().trim(), 'No Data.', 'No Data.');
    assert.equal(find('.table-default .pagination').classList.contains('hidden'), true, 'Pagination is hidden');
  });

  test('Check table pagination - 5 pages (.table-default)', async function(assert) {
    server.createList('user', 50);
    await visit('/');

    assert.equal(currentURL(), '/');

    assert.equal(findAll('.table-default table tbody tr').length, 10, 'Check for 10 items in table');
    assert.equal(findAll('.table-default .pagination > *').length, 7, 'Pagination is 5 pages');
  });

  test('Check for expected content (.table-default)', async function(assert) {
    server.loadFixtures('users');
    await visit('/');

    assert.equal(currentURL(), '/');

    let cells = find('.table-default table tbody tr').eq(0).find('td');

    assert.equal(cells.eq(0).text().trim(), 'AnakinSkywalker9', 'Check for username');
    assert.equal(cells.eq(1).text().trim(), 'skywalker@domain.com', 'Check for email');
    assert.equal(cells.eq(2).text().trim(), '1082hudsasd', 'Check for password');
    assert.equal(cells.eq(3).text().trim(), 'Anakin', 'Check for first name');
    assert.equal(cells.eq(4).text().trim(), 'Skywalker', 'Check for last name');
    assert.equal(cells.eq(5).text().trim(), 'false', 'Check for is admin');
    assert.equal(cells.eq(6).text().trim(), 'Wed Jul 22 2009 00:00:00 GMT+0000', 'Check for created at');
    assert.equal(cells.eq(7).text().trim(), 'Thu Jul 23 2009 00:00:00 GMT+0000', 'Check for updated at');

    assert.equal(findAll('.table-default table tbody tr').length, 10, 'Check for 10 items in table');
  });

  test('Check for expected content (.table-column-select)', async function(assert) {
    server.loadFixtures('users');
    await visit('/');

    assert.equal(currentURL(), '/');

    let cells = find('.table-column-select table tbody tr').eq(0).find('td');

    assert.equal(cells.eq(0).text().trim(), 'AnakinSkywalker9', 'Check for username');
    assert.equal(cells.eq(1).text().trim(), 'skywalker@domain.com', 'Check for email');
    assert.equal(cells.eq(2).text().trim(), 'Anakin', 'Check for first name');
    assert.equal(cells.eq(3).text().trim(), 'Skywalker', 'Check for last name');
    assert.equal(cells.eq(4).text().trim(), 'No', 'Check for is admin');
    assert.equal(cells.eq(5).text().trim(), '07/23/2009', 'Check for last updated');
    assert.equal(cells.eq(6).text().trim(), 'Edit', 'Check for edit link');

    assert.equal(findAll('.table-column-select table tbody tr').length, 10, 'Check for 10 items in table');
  });

  test('Check for pagination reset after filter change (.table-column-select)', async function(assert) {
    server.createList('user', 25, {
      isAdmin: true,
    });
    server.createList('user', 5, {
      isAdmin: false,
    });
    await visit('/');

    assert.equal(currentURL(), '/');

    await click('.table-column-select .pagination li:eq(2) a');
    let request = getPretenderRequest(server, 'GET', 'users')[0];
    assert.equal(request.url, '/users?page%5Blimit%5D=10&page%5Boffset%5D=10&sort=username', 'Expected for offset 10 in URL');

    assert.equal(findAll('.table-column-select table tbody tr').length, 10, 'Check for 10 items in table');
    await click(find('.table-override-columns-template table .btn-toggle-filter'));
    // filter by is-admin
    selectChoose('.table-override-columns-template .ember-tabular-ember-power-select', 'Yes');
    let request2 = getPretenderRequest(server, 'GET', 'users')[0];
    assert.equal(request2.url, '/users?filter%5Bis-admin%5D=true&page%5Blimit%5D=10&page%5Boffset%5D=0&sort=username', 'Expected query params in URL but page is reset to 1, offset 0');

    assert.equal(findAll('.table-column-select table tbody tr').length, 10, 'Check for 10 items in table');
  });

  test('Check for hidden column after interacting with column-select component (.table-column-select)', async function(assert) {
    server.loadFixtures('users');
    await visit('/');

    assert.equal(currentURL(), '/');

    let cells = find('.table-column-select table tbody tr').eq(0).find('td');

    assert.equal(findAll('.table-column-select table thead tr th').length, 7, 'Show expected number of <th> columns');
    assert.equal(cells.length, 7, 'Show expected number of <td> columns');
    assert.equal(cells.eq(0).text().trim(), 'AnakinSkywalker9', 'Check for username');
    assert.equal(cells.eq(1).text().trim(), 'skywalker@domain.com', 'Check for email');

    await click('.table-column-select .btn-group-column-select button');
    await click('.table-column-select .btn-group-column-select li:eq(0) a');
    let cells2 = find('.table-column-select table tbody tr').eq(0).find('td');

    assert.equal(findAll('.table-column-select table thead tr th').length, 6, 'Show expected number of <th> columns');
    assert.equal(cells2.length, 6, 'Show expected number of <td> columns');
    assert.equal(cells2.eq(0).text().trim(), 'skywalker@domain.com', 'Check for email, username is hidden');
    assert.equal(cells2.eq(1).text().trim(), 'Anakin', 'Check for first name');

    await click('.table-column-select .btn-group-column-select button');
    await click('.table-column-select .btn-group-column-select li:eq(0) a');
  });

  test('Check for expected content (.table-override-columns-template)', async function(assert) {
    server.loadFixtures('users');
    await visit('/');

    assert.equal(currentURL(), '/');

    let cells = find('.table-override-columns-template table tbody tr').eq(0).find('td');

    assert.equal(cells.eq(0).text().trim(), 'AnakinSkywalker9', 'Check for username');
    assert.equal(cells.eq(1).text().trim(), 'skywalker@domain.com', 'Check for email');
    assert.equal(cells.eq(2).text().trim(), 'Anakin', 'Check for first name');
    assert.equal(cells.eq(3).text().trim(), 'Skywalker', 'Check for last name');
    assert.equal(cells.eq(4).text().trim(), 'No', 'Check for is admin');
    assert.equal(cells.eq(5).text().trim(), '07/23/2009', 'Check for last updated');
    assert.equal(cells.eq(6).text().trim(), 'Edit', 'Check for edit link');

    assert.equal(findAll('.table-override-columns-template table tbody tr').length, 10, 'Check for 10 items in table');
  });

  test('Check for proper row count when dropdown-limit is changed (.table-default)', async function(assert) {
    server.createList('user', 50);
    await visit('/');

    assert.equal(currentURL(), '/');

    let rows = find('.table-default table tbody tr');
    assert.equal(rows.length, 10, 'Check for 10 items in table');

    // change table limit to 25
    selectChoose($('.table-default .limit:eq(0)')[0], '25');

    let rows2 = find('.table-default table tbody tr');
    assert.equal(rows2.length, 25, 'Check for 25 items in table');
  });

  test('Check for dropdown-limit autoHide (.table-default)', async function(assert) {
    server.createList('user', 10);
    await visit('/');

    assert.equal(currentURL(), '/');

    let rows = find('.table-default table tbody tr');
    assert.equal(rows.length, 10, 'Check for 10 items in table');

    assert.equal(findAll('.table-default .ember-tabular-dropdown-limit > *').length, 0, 'ember-tabular-dropdown-limit is hidden');
  });

  test('Check for error handling', async function(assert) {
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
    await visit('/');

    assert.equal(currentURL(), '/');

    assertIn(assert, find('.alert').textContent, 'Error', 'Check for general error message.');
  });

  test('Check table rendering for no data or loading (.table-default)', async function(assert) {
    server.loadFixtures('users');
    await visit('/');

    assert.equal(currentURL(), '/');

    let store = application.__container__.lookup('service:store');
    store.unloadAll('user');
    let cells = find('.table-default table tbody tr').eq(0).find('td');

    assertIn(assert, cells.eq(0).html().trim(), 'No Data.', 'No Data.');
  });

  test('Check table rendering for pagination (.table-default)', async function(assert) {
    server.loadFixtures('users');
    await visit('/');

    assert.equal(currentURL(), '/');
    // Transition to the next page
    await click('.table-default .pagination .next a');
    var cells = find('.table-default table tbody tr').eq(0).find('td');

    assert.equal(cells.eq(0).text().trim(), 'mcclane.jr', 'Check for username');
    assert.equal(cells.eq(1).text().trim(), 'jack.mcclane@domain.com', 'Check for email');
    assert.equal(cells.eq(2).text().trim(), 'h1d69sljq98', 'Check for password');
    assert.equal(cells.eq(3).text().trim(), 'Jack', 'Check for first name');
    assert.equal(cells.eq(4).text().trim(), 'McClane', 'Check for last name');
    assert.equal(cells.eq(5).text().trim(), 'false', 'Check for is admin');
    assert.equal(cells.eq(6).text().trim(), 'Sun Jan 01 2017 00:00:00 GMT+0000', 'Check for created at');
    assert.equal(cells.eq(7).text().trim(), 'Mon Jan 02 2017 00:00:00 GMT+0000', 'Check for updated at');

    assert.equal(findAll('.table-default table tbody tr').length, 2, 'Check for 2 items in table on second page');
  });

  test('Check for expected content sorting (.table-default)', async function(assert) {
    server.loadFixtures('users');
    await visit('/');

    assert.equal(currentURL(), '/');

    await click('.table-default table th:contains("Last Name") .btn-sort');
    let cells = find('.table-default table tbody tr').eq(0).find('td');

    assert.equal(cells.eq(0).text().trim(), 'Dooku', 'Check for username');
    assert.equal(cells.eq(1).text().trim(), 'count.dooku@domain.com', 'Check for email');
    assert.equal(cells.eq(2).text().trim(), '-912dh9ds', 'Check for password');
    assert.equal(cells.eq(3).text().trim(), 'Count', 'Check for first name');
    assert.equal(cells.eq(4).text().trim(), 'Dooku', 'Check for last name');
    assert.equal(cells.eq(5).text().trim(), 'false', 'Check for is admin');
    assert.equal(cells.eq(6).text().trim(), 'Sat Jul 22 2006 00:00:00 GMT+0000', 'Check for created at');
    assert.equal(cells.eq(7).text().trim(), 'Sun Jul 23 2006 00:00:00 GMT+0000', 'Check for updated at');

    assert.equal(findAll('.table-default table tbody tr').length, 10, 'Check for 10 items in table');
    let request = getPretenderRequest(server, 'GET', 'users')[0];

    assert.equal(request.status, 200);
    assert.equal(request.method, 'GET');
    assert.equal(request.url, '/users?page%5Blimit%5D=10&page%5Boffset%5D=0&sort=last-name', 'Expected query params in URL');
  });

  test('Check for disabled sorting (.table-override-columns-template)', async function(assert) {
    server.loadFixtures('users');
    await visit('/');

    assert.equal(currentURL(), '/');

    await click('.table-override-columns-template table th:contains("Last Updated")');
    let cells = find('.table-override-columns-template table tbody tr').eq(0).find('td');

    assert.equal(find('.table-override-columns-template #updated-at').classList.contains('sortable'), false, 'Check for missing sortable class');

    assert.equal(cells.eq(0).text().trim(), 'AnakinSkywalker9', 'Check for username');
    assert.equal(cells.eq(1).text().trim(), 'skywalker@domain.com', 'Check for email');
    assert.equal(cells.eq(2).text().trim(), 'Anakin', 'Check for first name');
    assert.equal(cells.eq(3).text().trim(), 'Skywalker', 'Check for last name');
    assert.equal(cells.eq(5).text().trim(), '07/23/2009', 'Check for date');
    assert.equal(cells.eq(6).find('a').text().trim(), 'Edit', 'Check for actions');

    assert.equal(findAll('.table-override-columns-template table tbody tr').length, 10, 'Check for 10 items in table');
    let request = getPretenderRequest(server, 'GET', 'users')[4];

    assert.equal(request.status, 200);
    assert.equal(request.method, 'GET');
    assert.equal(request.url, '/users?page%5Blimit%5D=10&page%5Boffset%5D=0&sort=username', 'Expected query params in URL, no sort');
  });

  test('Check for expected content filter (.table-default)', async function(assert) {
    server.loadFixtures('users');
    await visit('/');

    assert.equal(currentURL(), '/');

    await click(find('.table-default table .btn-toggle-filter'));
    await fillIn('.table-default table thead tr:eq(1) th:eq(4) input', 'McClane');
    find('.table-default table thead tr:eq(1) th:eq(4) input').trigger('keyup');
    let cells = find('.table-default table tbody tr').eq(0).find('td');

    assert.equal(cells.eq(0).text().trim(), 'YippieKiYay', 'Check for username');
    assert.equal(cells.eq(1).text().trim(), 'john.mcclane@domain.com', 'Check for email');
    assert.equal(cells.eq(2).text().trim(), '12s2s2132x', 'Check for password');
    assert.equal(cells.eq(3).text().trim(), 'John', 'Check for first name');
    assert.equal(cells.eq(4).text().trim(), 'McClane', 'Check for last name');
    assert.equal(cells.eq(5).text().trim(), 'true', 'Check for is admin');
    assert.equal(cells.eq(6).text().trim(), 'Sun Jan 01 2017 00:00:00 GMT+0000', 'Check for created at');
    assert.equal(cells.eq(7).text().trim(), 'Mon Jan 02 2017 00:00:00 GMT+0000', 'Check for updated at');

    assert.equal(findAll('.table-default table tbody tr').length, 2, 'Check for 2 items in table');
    let request = getPretenderRequest(server, 'GET', 'users')[0];

    assert.equal(request.status, 200);
    assert.equal(request.method, 'GET');
    assert.equal(request.url, '/users?filter%5Blast-name%5D=McClane&page%5Blimit%5D=10&page%5Boffset%5D=0&sort=username', 'Expected query params in URL');
  });

  test('Check for expected content multiple filters (.table-default)', async function(assert) {
    server.loadFixtures('users');
    await visit('/');

    assert.equal(currentURL(), '/');

    await click(find('.table-default table .btn-toggle-filter'));
    await fillIn('.table-default table thead tr:eq(1) th:eq(3) input', 'John');
    find('.table-default table thead tr:eq(1) th:eq(3) input').trigger('keyup');
    await fillIn('.table-default table thead tr:eq(1) th:eq(4) input', 'McClane');
    find('.table-default table thead tr:eq(1) th:eq(4) input').trigger('keyup');
    var cells = find('.table-default table tbody tr').eq(0).find('td');

    assert.equal(cells.eq(0).text().trim(), 'YippieKiYay', 'Check for username');
    assert.equal(cells.eq(1).text().trim(), 'john.mcclane@domain.com', 'Check for email');
    assert.equal(cells.eq(2).text().trim(), '12s2s2132x', 'Check for password');
    assert.equal(cells.eq(3).text().trim(), 'John', 'Check for first name');
    assert.equal(cells.eq(4).text().trim(), 'McClane', 'Check for last name');
    assert.equal(cells.eq(5).text().trim(), 'true', 'Check for is admin');
    assert.equal(cells.eq(6).text().trim(), 'Sun Jan 01 2017 00:00:00 GMT+0000', 'Check for created at');
    assert.equal(cells.eq(7).text().trim(), 'Mon Jan 02 2017 00:00:00 GMT+0000', 'Check for updated at');

    assert.equal(findAll('.table-default table tbody tr').length, 1, 'Check for 1 item in table');
    var request = getPretenderRequest(server, 'GET', 'users')[0];

    assert.equal(request.status, 200);
    assert.equal(request.method, 'GET');
    assert.equal(request.url, '/users?filter%5Bfirst-name%5D=John&filter%5Blast-name%5D=McClane&page%5Blimit%5D=10&page%5Boffset%5D=0&sort=username', 'Expected query params in URL');
  });

  test('Check for expected content sort/filter (.table-default)', async function(assert) {
    server.loadFixtures('users');
    await visit('/');

    assert.equal(currentURL(), '/');

    await click('.table-default table th:contains("Last Name") .btn-sort');
    await click(find('.table-default table .btn-toggle-filter'));
    await fillIn('.table-default table thead tr:eq(1) th:eq(4) input', 'McClane');
    find('.table-default table thead tr:eq(1) th:eq(4) input').trigger('keyup');
    let cells = find('.table-default table tbody tr').eq(0).find('td');

    assert.equal(cells.eq(0).text().trim(), 'YippieKiYay', 'Check for username');
    assert.equal(cells.eq(1).text().trim(), 'john.mcclane@domain.com', 'Check for email');
    assert.equal(cells.eq(2).text().trim(), '12s2s2132x', 'Check for password');
    assert.equal(cells.eq(3).text().trim(), 'John', 'Check for first name');
    assert.equal(cells.eq(4).text().trim(), 'McClane', 'Check for last name');
    assert.equal(cells.eq(5).text().trim(), 'true', 'Check for is admin');
    assert.equal(cells.eq(6).text().trim(), 'Sun Jan 01 2017 00:00:00 GMT+0000', 'Check for created at');
    assert.equal(cells.eq(7).text().trim(), 'Mon Jan 02 2017 00:00:00 GMT+0000', 'Check for updated at');

    assert.equal(findAll('.table-default table tbody tr').length, 2, 'Check for 1 item in table');
    let request = getPretenderRequest(server, 'GET', 'users')[0];

    assert.equal(request.status, 200);
    assert.equal(request.method, 'GET');
    assert.equal(request.url, '/users?filter%5Blast-name%5D=McClane&page%5Blimit%5D=10&page%5Boffset%5D=0&sort=last-name', 'Expected query params in URL');
  });

  test('Check for expected content dropdown filter (.table-override-columns-template)', async function(assert) {
    server.loadFixtures('users');
    await visit('/');

    assert.equal(currentURL(), '/');

    await click(find('.table-override-columns-template table .btn-toggle-filter'));
    selectChoose('.table-override-columns-template .ember-tabular-ember-power-select', 'Yes');
    var request = getPretenderRequest(server, 'GET', 'users')[0];

    assert.equal(request.status, 200);
    assert.equal(request.method, 'GET');
    assert.equal(request.url, '/users?filter%5Bis-admin%5D=true&page%5Blimit%5D=10&page%5Boffset%5D=0&sort=username', 'Expected query params in URL');
  });

  test('Check for expected content dropdown filter (.table-column-select) (pass in array of values for dropdown into ember-tabular-column)', async function(assert) {
    server.loadFixtures('users');
    await visit('/');

    assert.equal(currentURL(), '/');

    await click(find('.table-column-select table .btn-toggle-filter'));
    selectChoose('.table-column-select .ember-tabular-ember-power-select', 'Yes');
    var request = getPretenderRequest(server, 'GET', 'users')[0];

    assert.equal(request.status, 200);
    assert.equal(request.method, 'GET');
    assert.equal(request.url, '/users?filter%5Bis-admin%5D=true&page%5Blimit%5D=10&page%5Boffset%5D=0&sort=username', 'Expected query params in URL');
  });

  test('Check for dropdown clear success (.table-override-columns-template)', async function(assert) {
    server.loadFixtures('users');
    await visit('/');

    assert.equal(currentURL(), '/');

    await click(find('.table-override-columns-template .btn-toggle-filter'));
    selectChoose($('.table-override-columns-template .ember-tabular-ember-power-select:eq(0)')[0], 'Yes');
    var request = getPretenderRequest(server, 'GET', 'users')[0];

    assert.equal(request.url, '/users?filter%5Bis-admin%5D=true&page%5Blimit%5D=10&page%5Boffset%5D=0&sort=username', 'Expected query params in URL');
    await click(find('.table-override-columns-template .ember-power-select-clear-btn'));

    var request = getPretenderRequest(server, 'GET', 'users')[0];

    assert.equal(request.url, '/users?page%5Blimit%5D=10&page%5Boffset%5D=0&sort=username', 'Expected query params in URL');
  });

  test('Check for expected content after filtering (.table-basic-global-filter)', async function(assert) {
    server.loadFixtures('users');
    await visit('/');

    assert.equal(currentURL(), '/');
    await fillIn('.table-basic-global-filter .table-filter input', 'YippieKiYay');
    find('.table-basic-global-filter .table-filter input').trigger('keyup');
    let cells = find('.table-basic-global-filter table tbody tr').eq(0).find('td');

    assert.equal(cells.eq(0).text().trim(), 'YippieKiYay', 'Check for username');
    assert.equal(cells.eq(1).text().trim(), 'john.mcclane@domain.com', 'Check for email');
    assert.equal(cells.eq(2).text().trim(), 'John', 'Check for first name');
    assert.equal(cells.eq(3).text().trim(), 'McClane', 'Check for last name');
    assert.equal(cells.eq(4).text().trim(), 'true', 'Check for is admin');
    assert.equal(cells.eq(5).length, 0, 'Check for no more columns');

    assert.equal(findAll('.table-basic-global-filter table tbody tr').length, 1, 'Check for 1 item in table');
    let request = getPretenderRequest(server, 'GET', 'users')[0];

    assert.equal(request.status, 200);
    assert.equal(request.method, 'GET');
    assert.equal(request.url, '/users?filter%5Busername%5D=YippieKiYay&page%5Blimit%5D=10&page%5Boffset%5D=0&sort=', 'Expected query params in URL');
  });

  test('Check for proper order of ommitted columns from orderColumn within column select list(.table-basic-global-filter)', async function(assert) {
    server.loadFixtures('users');
    await visit('/');

    assert.equal(currentURL(), '/');

    let columnSelectItem = find('.table-basic-global-filter .btn-group-column-select .dropdown-menu > li');

    assert.equal(columnSelectItem.length, 8, 'Check for 8 items in column select list');
    assert.equal(columnSelectItem.eq(0).text().trim(), 'Username', 'Check for username');
    assert.equal(columnSelectItem.eq(1).text().trim(), 'Email Address', 'Check for email');
    assert.equal(columnSelectItem.eq(2).text().trim(), 'First Name', 'Check for first name');
    assert.equal(columnSelectItem.eq(3).text().trim(), 'Last Name', 'Check for last name');
    assert.equal(columnSelectItem.eq(4).text().trim(), 'Is Admin', 'Check for is admin');
    assert.equal(columnSelectItem.eq(5).text().trim(), 'Password', 'Check for password, item not within columnOrder');
    assert.equal(columnSelectItem.eq(6).text().trim(), 'Created At', 'Check for created at, item not within columnOrder');
    assert.equal(columnSelectItem.eq(7).text().trim(), 'Updated At', 'Check for updated at, item not within columnOrder');
  });

  test('Check for clearFilter action success (.table-default)', async function(assert) {
    server.loadFixtures('users');
    await visit('/');

    assert.equal(currentURL(), '/');
    await click(find('.table-default table .btn-toggle-filter'));
    await fillIn('.table-default table thead tr:eq(1) th:eq(4) input', 'McClane');
    find('.table-default table thead tr:eq(1) th:eq(4) input').trigger('keyup');
    assert.equal(findAll('.table-default table tbody tr').length, 2, 'Check for 2 item in table');
    await click('.table-default table .clearFilter');
    assert.equal(findAll('.table-default table tbody tr').length, 10, 'Check for 10 item in table');
  });

  test('Check for clearFilter action success (.table-basic-global-filter )', async function(assert) {
    server.loadFixtures('users');
    await visit('/');

    assert.equal(currentURL(), '/');
    await fillIn('.table-basic-global-filter .table-filter input', 'YippieKiYay');
    find('.table-basic-global-filter .table-filter input').trigger('keyup');
    assert.equal(findAll('.table-basic-global-filter table tbody tr').length, 1, 'Check for 1 item in table');
    await click('.table-basic-global-filter .clearFilter');
    assert.equal(findAll('.table-basic-global-filter table tbody tr').length, 10, 'Check for 10 item in table');
  });

  test('Check to filter by date and is-admin (.table-basic-global-date-filter)', async function(assert) {
    server.loadFixtures('users');
    await visit('/');

    assert.equal(currentURL(), '/');
    selectChoose($('.table-basic-global-date-filter .ember-tabular-ember-power-select:eq(0)')[0], 'Yes');

    await fillIn(find('.table-basic-global-date-filter .table-filter input'), '2017-01-02');
    find(find('.table-basic-global-date-filter .table-filter input')).trigger('keyup');
    assert.equal(findAll('.table-basic-global-date-filter table tbody tr').length, 1, 'Check for 1 item in table');

    let request = getPretenderRequest(server, 'GET', 'users')[0];

    assert.equal(request.status, 200);
    assert.equal(request.method, 'GET');
    assert.equal(request.url, '/users?filter%5Bis-admin%5D=true&filter%5Bupdated-at%5D=2017-01-02&page%5Blimit%5D=10&page%5Boffset%5D=0&sort=', 'Expected query params in URL');
  });

  test('Check for infinite request loop (.table-basic-global-date-filter)', async function(assert) {
    // error occurs if controller properties that are shared
    // with ember-tabular components are not defined within controller
    server.loadFixtures('users');
    await visit('/');

    assert.equal(currentURL(), '/');
    // only trigger date
    await fillIn(find('.table-basic-global-date-filter .table-filter input'), '2017-01-02');
    find(find('.table-basic-global-date-filter .table-filter input')).trigger('keyup');
    let request = getPretenderRequest(server, 'GET', 'users')[0];

    assert.equal(request.url, '/users?filter%5Bupdated-at%5D=2017-01-02&page%5Blimit%5D=10&page%5Boffset%5D=0&sort=', 'Expected query params in URL');

    Ember.run.later(function() {
      var requests = getPretenderRequest(server, 'GET');
      assert.equal(requests.reduce(function(n, request) {return n + (request.url === '/users?filter%5Bupdated-at%5D=2017-01-02&page%5Blimit%5D=10&page%5Boffset%5D=0&sort=');}, 0), 1, '1 GET request to /users are occurring');
    }, 1000);
  });

  test('Check for date clearFilter action success (.table-basic-global-date-filter)', async function(assert) {
    server.loadFixtures('users');
    await visit('/');

    assert.equal(currentURL(), '/');
    await fillIn(find('.table-basic-global-date-filter .table-filter input'), '2017-01-02');
    find(find('.table-basic-global-date-filter .table-filter input')).trigger('keyup');
    assert.equal(findAll('.table-basic-global-date-filter table tbody tr').length, 2, 'Check for 2 items in table');
    await click('.table-basic-global-date-filter .clearFilter');
    assert.equal(findAll('.table-basic-global-date-filter table tbody tr').length, 10, 'Check for 10 item in table');
  });

  test('Check for persistent filters on transition (.table-persist)', async function(assert) {
    server.loadFixtures('users');
    await visit('/');

    assert.equal(currentURL(), '/');
    assert.equal(findAll('.table-persist table tbody tr').length, 10, 'Check for 10 item in table');
    await click(find('.table-persist table .btn-toggle-filter'));
    await fillIn('.table-persist table thead tr:eq(1) th:eq(3) input', 'McClane');
    find('.table-persist table thead tr:eq(1) th:eq(3) input').trigger('keyup');
    assert.equal(findAll('.table-persist table tbody tr').length, 2, 'Check for 2 item in table');
    // transition to different page
    await click('.link-ex4');
    // transition back to index
    await click('.link-index');
    assert.equal(findAll('.table-persist table tbody tr').length, 2, 'Check for 2 item in table');

    await click(find('.table-persist table .btn-toggle-filter'));
    assert.equal(find('.table-persist table thead tr:eq(1) th:eq(3) input').value, 'McClane', 'Check for populated filter on transition');
    let request = getPretenderRequest(server, 'GET', 'users');

    assert.equal(request.length, 16, 'Check that additional request was not made when opening filter row');
  });

  test('Check for persistent columnOrder (isActive) on transition (.table-column-select)', async function(assert) {
    server.loadFixtures('users');
    await visit('/');

    assert.equal(currentURL(), '/');
    assert.equal(find('.table-column-select table thead tr:eq(0) th:last-child').textContent.trim(), 'Actions', 'Check for last column in table being Actions');
    await click('.table-column-select .btn-group-column-select button');
    // click password
    await click('.table-column-select .btn-group-column-select li:eq(7) a');
    assert.equal(find('.table-column-select table thead tr:eq(0) th:last-child').textContent.trim(), 'Password', 'Check for last column in table being Password');
    // transition to different page
    await click('.link-ex4');
    assert.equal(currentURL(), 'example4');
    // transition back to index
    await click('.link-index');
    assert.equal(currentURL(), '/');
    assert.equal(find('.table-column-select table thead tr:eq(0) th:last-child').textContent.trim(), 'Password', 'Check for last column in table being Password');
  });

  test('Check for expected request count when transitioning', async function(assert) {
    server.loadFixtures('users');
    await visit('/');

    assert.equal(currentURL(), '/');

    // transition user to other page
    await click('.link-ex4');
    let request = getPretenderRequest(server, 'GET', 'users');

    assert.equal(request.length, 8, 'Should only see 8 requests, checking to ensure extra requests are not made on transition');
  });

  test('Check for expected content (.table-select-row)', async function(assert) {
    server.loadFixtures('users');
    await visit('/');

    assert.equal(currentURL(), '/');

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

    assert.equal(findAll('.table-select-row table tbody tr').length, 10, 'Check for 10 items in table');
  });

  test('Check for checking all rows (.table-select-row)', async function(assert) {
    server.loadFixtures('users');
    await visit('/');

    assert.equal(currentURL(), '/');

    await click('.table-select-row .allChecked');
    let rows = find('.table-select-row table tbody tr');

    assert.equal(rows.eq(0).find('td:eq(0) input').prop('checked'), true, 'Check for checked checkbox');
    assert.equal(rows.eq(1).find('td:eq(0) input').prop('checked'), true, 'Check for checked checkbox');
    assert.equal(rows.eq(2).find('td:eq(0) input').prop('checked'), true, 'Check for checked checkbox');

    await click('.table-select-row .allChecked');
    let rows2 = find('.table-select-row table tbody tr');

    assert.equal(rows2.eq(0).find('td:eq(0) input').prop('checked'), false, 'Check for unchecked checkbox');
    assert.equal(rows2.eq(1).find('td:eq(0) input').prop('checked'), false, 'Check for unchecked checkbox');
    assert.equal(rows2.eq(2).find('td:eq(0) input').prop('checked'), false, 'Check for unchecked checkbox');
  });

  test('Check for checking rows using shift + click (.table-select-row)', async function(assert) {
    server.loadFixtures('users');
    await visit('/');

    assert.equal(currentURL(), '/');

    let rows = find('.table-select-row table tbody tr');

    // select the second row through the 5th
    await click(find(rows.eq(1).find('td:eq(0) input[type="checkbox"]:eq(0)')));
    await triggerEvent(find(rows.eq(4).find('td:eq(0) input[type="checkbox"]:eq(0)')), 'click', {
        shiftKey: true,
    });

    assert.equal(rows.eq(0).find('td:eq(0) input').prop('checked'), false, 'Check for unchecked checkbox');
    assert.equal(rows.eq(1).find('td:eq(0) input').prop('checked'), true, 'Check for checked checkbox');
    assert.equal(rows.eq(2).find('td:eq(0) input').prop('checked'), true, 'Check for checked checkbox');
    assert.equal(rows.eq(3).find('td:eq(0) input').prop('checked'), true, 'Check for checked checkbox');
    assert.equal(rows.eq(4).find('td:eq(0) input').prop('checked'), true, 'Check for checked checkbox');
    assert.equal(rows.eq(5).find('td:eq(0) input').prop('checked'), false, 'Check for unchecked checkbox');
  });
});
