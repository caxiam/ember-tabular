import { set } from '@ember/object';
import {
  click,
  fillIn,
  find,
  findAll,
  currentURL,
  triggerEvent,
  visit,
  pauseTest
} from '@ember/test-helpers';
import {
  assertIn,
  getPretenderRequest,
  getLastPretenderRequest
} from '../../tests/helpers/util';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';


module('Acceptance: Relationships Tests', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('Check for expected url when filtering relationships', async function(assert) {
    server.loadFixtures('users');
    await visit('/');

    assert.equal(currentURL(), '/');

    // Override first table column.property to be relationship
    let controller = this.owner.lookup('controller:index');
    set(controller.columns[0], 'property', 'account.username');
    await click(find('.table-override-columns-template table .btn-toggle-filter'));
    await fillIn(findAll('.table-override-columns-template table thead tr')[1].getElementsByTagName('input')[0], 'Testing');
    let request = getLastPretenderRequest(server);

    assert.equal(request.status, 200);
    assert.equal(request.method, 'GET');
    assert.equal(request.url, '/users?filter%5Baccount.username%5D=Testing&page%5Blimit%5D=10&page%5Boffset%5D=0&sort=username', 'URL has relationship in dot notation');
    // clear filter
    await click('.table-override-columns-template table .clearFilter');
    // make another request to the relationship
    await fillIn(findAll('.table-override-columns-template table thead tr')[1].getElementsByTagName('input')[0], 'Testing2');
    let request2 = getLastPretenderRequest(server);

    assert.equal(request2.status, 200);
    assert.equal(request2.method, 'GET');
    assert.equal(request2.url, '/users?filter%5Baccount.username%5D=Testing2&page%5Blimit%5D=10&page%5Boffset%5D=0&sort=username', 'URL has retained dot notation');
  });
});
