import moduleForAcceptance from '../helpers/module-for-acceptance';
import { test } from 'qunit';

moduleForAcceptance('Acceptance: Simple Table', {
    integration: true,
});

test('Check for expected content /', function(assert) {
    server.loadFixtures('users');
    visit('/');

    andThen(function() {
        assert.equal(currentPath(), 'index');

        var cells = find('table tbody tr').eq(0).find('td');

        assert.equal(cells.eq(0).html(), 'AnakinSkywalker9', 'Check for username');
        assert.equal(cells.eq(1).html(), 'skywalker@domain.com', 'Check for email');
        assert.equal(cells.eq(2).html(), 'Anakin', 'Check for first name');
        assert.equal(cells.eq(3).html(), 'Skywalker', 'Check for last name');
        assert.equal(cells.eq(4).text().trim(), '07/23/2009', 'Check for date');
        assert.equal(cells.eq(5).find('a').text().trim(), 'Edit', 'Check for actions');

        assert.equal(find('table tbody tr').length, 10, 'Check for 10 items in table');
    });
});

test('Check table rendering of / for no data or loading', function(assert) {
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
        var cells = find('table tbody tr').eq(0).find('td');

        assert.equal(cells.eq(0).html().trim(), 'No Data.', 'No Data.');
    });
});

test('Check table rendering of / for pagination', function(assert) {
    server.loadFixtures('users');
    visit('/');

    andThen(function() {
        assert.equal(currentPath(), 'index');
        // Transition to the next page
        click('.pagination .next a');
    });

    andThen(function() {
        var cells = find('table tbody tr').eq(0).find('td');

        assert.equal(cells.eq(0).html(), 'starLord', 'Check for username');
        assert.equal(cells.eq(1).html(), 'starLord@domain.com', 'Check for email');
        assert.equal(cells.eq(2).html(), 'Peter', 'Check for first name');
        assert.equal(cells.eq(3).html(), 'Quill', 'Check for last name');
        assert.equal(cells.eq(4).text().trim(), '08/02/2014', 'Check for date');
        assert.equal(cells.eq(5).find('a').text().trim(), 'Edit', 'Check for actions');

        assert.equal(find('table tbody tr').length, 1, 'Check for 10 items in table');
    });
});

test('Check for expected content sorting /', function(assert) {
    server.loadFixtures('users');
    visit('/');

    andThen(function() {
        assert.equal(currentPath(), 'index');

        click('table th:contains("Last Name")');
    });

    andThen(function() {
        var cells = find('table tbody tr').eq(0).find('td');

        assert.equal(cells.eq(0).html(), 'Dooku', 'Check for username');
        assert.equal(cells.eq(1).html(), 'count.dooku@domain.com', 'Check for email');
        assert.equal(cells.eq(2).html(), 'Count', 'Check for first name');
        assert.equal(cells.eq(3).html(), 'Dooku', 'Check for last name');
        assert.equal(cells.eq(4).text().trim(), '07/23/2006', 'Check for date');
        assert.equal(cells.eq(5).find('a').text().trim(), 'Edit', 'Check for actions');

        assert.equal(find('table tbody tr').length, 10, 'Check for 10 items in table');
    });

    andThen(function() {
        var request = getPretenderRequest(server, 'GET', 'users')[0];

        assert.equal(request.status, 200);
        assert.equal(request.method, 'GET');
        assert.equal(request.url, '/users?limit=10&offset=0&page=1&sort=last-name', 'Expected query params in URL');
    });
});
