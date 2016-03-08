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

        assert.equal(cells.eq(0).html(), 'YippieKiYay', 'Check for username');
        assert.equal(cells.eq(1).html(), 'john.mcclane@domain.com', 'Check for email');
        assert.equal(cells.eq(2).html(), 'John', 'Check for first name');
        assert.equal(cells.eq(3).html(), 'McClane', 'Check for last name');
        assert.equal(cells.eq(4).text().trim(), '01/02/2017', 'Check for date');
        assert.equal(cells.eq(5).find('a').text().trim(), 'Edit', 'Check for actions');

        assert.equal(find('table tbody tr').length, 2, 'Check for 2 items in table');
    });
});

test('Check table rendering of / for no data or loading', function(assert) {
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
