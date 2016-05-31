import moduleForAcceptance from '../helpers/module-for-acceptance';
import { test } from 'qunit';
import startApp from '../helpers/start-app';
import destroyApp from '../helpers/destroy-app';
import Ember from 'ember';

var application;

moduleForAcceptance('Acceptance: Advanced Tests', {
    integration: true,
    beforeEach: function() {
        application = startApp();
    },
    afterEach: function() {
        destroyApp(application);
    }
});

test('Check for expected url when filtering relationships', function(assert) {
    server.loadFixtures('users');
    visit('/');

    andThen(function() {
        assert.equal(currentPath(), 'index');

        // Override first table column.property to be relationship
        var controller = application.__container__.lookup('controller:index');
        Ember.set(controller.columns[0], 'property', 'account.username');
    });

    andThen(function() {
        click('.table-default table .btn-toggle-filter:eq(0)');
        fillIn('.table-default table thead tr:eq(1) th:eq(0) input', 'Testing Relationships');
        find('.table-default table thead tr:eq(1) th:eq(0) input').trigger('keyup');
    });

    andThen(function() {
        var request = getLastPretenderRequest(server);

        assert.equal(request.status, 200);
        assert.equal(request.method, 'GET');
        assert.equal(request.url, '/users?filter%5Baccount.username%5D=Testing+Relationships&page%5Blimit%5D=10&page%5Boffset%5D=0&sort=username', 'URL has relationship in dot notation');
    });

    andThen(function() {
        // clear filter
        click('.table-default table .clearFilter');
    });

    andThen(function() {
        // make another request to the relationship
        fillIn('.table-default table thead tr:eq(1) th:eq(0) input', 'Testing Relationships 2');
        find('.table-default table thead tr:eq(1) th:eq(0) input').trigger('keyup');
    });

    andThen(function() {
        var request = getLastPretenderRequest(server);

        assert.equal(request.status, 200);
        assert.equal(request.method, 'GET');
        assert.equal(request.url, '/users?filter%5Baccount.username%5D=Testing+Relationships+2&page%5Blimit%5D=10&page%5Boffset%5D=0&sort=username', 'URL has retained dot notation');
    });
});
