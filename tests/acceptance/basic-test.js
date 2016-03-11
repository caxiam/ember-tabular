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

        var cells = find('table:eq(0) tbody tr').eq(0).find('td');

        assert.equal(find('table:eq(0) tbody tr').length, 1, 'Check for 1 items in table');
        assert.equal(cells.eq(0).html().trim(), 'No Data.', 'No Data.');
        assert.equal(find('.pagination:eq(0)').hasClass('hidden'), true, 'Pagination is hidden');
    });
});

test('Check table pagination - 5 pages', function(assert) {
    server.createList('user', 50);
    visit('/');

    andThen(function() {
        assert.equal(currentPath(), 'index');

        assert.equal(find('table:eq(0) tbody tr').length, 10, 'Check for 10 items in table');
        assert.equal(find('.pagination:eq(0) > *').length, 7, 'Pagination is 5 pages');
    });
});

test('Check for expected content', function(assert) {
    server.loadFixtures('users');
    visit('/');

    andThen(function() {
        assert.equal(currentPath(), 'index');

        var cells = find('table:eq(0) tbody tr').eq(0).find('td');

        assert.equal(cells.eq(0).html(), 'AnakinSkywalker9', 'Check for username');
        assert.equal(cells.eq(1).html(), 'skywalker@domain.com', 'Check for email');
        assert.equal(cells.eq(2).html(), 'Anakin', 'Check for first name');
        assert.equal(cells.eq(3).html(), 'Skywalker', 'Check for last name');
        assert.equal(cells.eq(4).text().trim(), '07/23/2009', 'Check for date');
        assert.equal(cells.eq(5).find('a').text().trim(), 'Edit', 'Check for actions');

        assert.equal(find('table:eq(0) tbody tr').length, 10, 'Check for 10 items in table');
    });
});

test('Check table rendering for no data or loading', function(assert) {
    server.loadFixtures('users');
    visit('/');

    andThen(function() {
        assert.equal(currentPath(), 'index');
    });

    var store = this.application.__container__.lookup('service:store');
    andThen(function() {
        store.unloadAll('user');
    });

    andThen(function() {
        var cells = find('table:eq(0) tbody tr').eq(0).find('td');

        assert.equal(cells.eq(0).html().trim(), 'No Data.', 'No Data.');
    });
});

test('Check table rendering for pagination', function(assert) {
    server.loadFixtures('users');
    visit('/');

    andThen(function() {
        assert.equal(currentPath(), 'index');
        // Transition to the next page
        click('.pagination:eq(0) .next a');
    });

    andThen(function() {
        var cells = find('table:eq(0) tbody tr').eq(0).find('td');

        assert.equal(cells.eq(0).html(), 'mcclane.jr', 'Check for username');
        assert.equal(cells.eq(1).html(), 'jack.mcclane@domain.com', 'Check for email');
        assert.equal(cells.eq(2).html(), 'Jack', 'Check for first name');
        assert.equal(cells.eq(3).html(), 'McClane', 'Check for last name');
        assert.equal(cells.eq(4).text().trim(), '01/02/2017', 'Check for date');
        assert.equal(cells.eq(5).find('a').text().trim(), 'Edit', 'Check for actions');

        assert.equal(find('table:eq(0) tbody tr').length, 2, 'Check for 2 items in table on second page');
    });
});

test('Check for expected content sorting', function(assert) {
    server.loadFixtures('users');
    visit('/');

    andThen(function() {
        assert.equal(currentPath(), 'index');

        click('table th:contains("Last Name")');
    });

    andThen(function() {
        var cells = find('table:eq(0) tbody tr').eq(0).find('td');

        assert.equal(cells.eq(0).html(), 'Dooku', 'Check for username');
        assert.equal(cells.eq(1).html(), 'count.dooku@domain.com', 'Check for email');
        assert.equal(cells.eq(2).html(), 'Count', 'Check for first name');
        assert.equal(cells.eq(3).html(), 'Dooku', 'Check for last name');
        assert.equal(cells.eq(4).text().trim(), '07/23/2006', 'Check for date');
        assert.equal(cells.eq(5).find('a').text().trim(), 'Edit', 'Check for actions');

        assert.equal(find('table:eq(0) tbody tr').length, 10, 'Check for 10 items in table');
    });

    andThen(function() {
        var request = getPretenderRequest(server, 'GET', 'users')[0];

        assert.equal(request.status, 200);
        assert.equal(request.method, 'GET');
        assert.equal(request.url, '/users?limit=10&offset=0&page=1&sort=last-name', 'Expected query params in URL');
    });
});

test('Check for expected content filter', function(assert) {
    server.loadFixtures('users');
    visit('/');

    andThen(function() {
        assert.equal(currentPath(), 'index');

        fillIn('table:eq(0) thead tr:eq(1) th:eq(3) input', 'McClane');
        find('table:eq(0) thead tr:eq(1) th:eq(3) input').trigger('keyup');
    });

    andThen(function() {
        var cells = find('table:eq(0) tbody tr').eq(0).find('td');

        assert.equal(cells.eq(0).html(), 'YippieKiYay', 'Check for username');
        assert.equal(cells.eq(1).html(), 'john.mcclane@domain.com', 'Check for email');
        assert.equal(cells.eq(2).html(), 'John', 'Check for first name');
        assert.equal(cells.eq(3).html(), 'McClane', 'Check for last name');
        assert.equal(cells.eq(4).text().trim(), '01/02/2017', 'Check for date');
        assert.equal(cells.eq(5).find('a').text().trim(), 'Edit', 'Check for actions');

        assert.equal(find('table:eq(0) tbody tr').length, 2, 'Check for 1 item in table');
    });

    andThen(function() {
        var request = getPretenderRequest(server, 'GET', 'users')[0];

        assert.equal(request.status, 200);
        assert.equal(request.method, 'GET');
        assert.equal(request.url, '/users?filter%5Blast-name%5D=McClane&limit=10&offset=0&page=1&sort=username', 'Expected query params in URL');
    });
});

test('Check for expected content filter', function(assert) {
    server.loadFixtures('users');
    visit('/');

    andThen(function() {
        assert.equal(currentPath(), 'index');

        click('table:eq(0) th:contains("Last Name")');
    });

    andThen(function() {
        fillIn('table:eq(0) thead tr:eq(1) th:eq(3) input', 'McClane');
        find('table:eq(0) thead tr:eq(1) th:eq(3) input').trigger('keyup');
    });

    andThen(function() {
        var cells = find('table:eq(0) tbody tr').eq(0).find('td');

        assert.equal(cells.eq(0).html(), 'YippieKiYay', 'Check for username');
        assert.equal(cells.eq(1).html(), 'john.mcclane@domain.com', 'Check for email');
        assert.equal(cells.eq(2).html(), 'John', 'Check for first name');
        assert.equal(cells.eq(3).html(), 'McClane', 'Check for last name');
        assert.equal(cells.eq(4).text().trim(), '01/02/2017', 'Check for date');
        assert.equal(cells.eq(5).find('a').text().trim(), 'Edit', 'Check for actions');

        assert.equal(find('table:eq(0) tbody tr').length, 2, 'Check for 1 item in table');
    });

    andThen(function() {
        var request = getPretenderRequest(server, 'GET', 'users')[0];

        assert.equal(request.status, 200);
        assert.equal(request.method, 'GET');
        assert.equal(request.url, '/users?filter%5Blast-name%5D=McClane&limit=10&offset=0&page=1&sort=last-name', 'Expected query params in URL');
    });
});
