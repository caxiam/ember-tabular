import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import jQuery from 'jquery';

module('Unit | Component | ember table jsonapi', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    await render(hbs`{{ember-tabular makeRequest=false}}`);

    let $component = jQuery(this);
    assert.equal($component.length, 1, 'It renders in DOM');
  });

  test('it displays table headers', async function(assert) {
    this.model = [
      {
        id: 1,
        username: 'YippieKiYay',
        emailAddress: 'john.mcclane@domain.com',
        firstName: 'John',
        lastName: 'McClane',
        isAdmin: true,
        createdAt: '2017-01-01',
        updatedAt: '2017-01-02'
      }, {
        id: 2,
        username: 'HanSolo',
        emailAddress: 'smugglerOne@domain.com',
        firstName: 'Han',
        lastName: 'Solo',
        isAdmin: false,
        createdAt: '2015-12-18',
        updatedAt: '2015-12-19'
      }
    ];
    this.columns = [
      {
        property: 'username',
        label: 'Username',
        isActive: true,
        type: 'text',
        defaultSort: 'username',
      },
      {
        property: 'email-address',
        label: 'Email',
        isActive: true,
        type: 'text',
      },
      {
        property: 'first-name',
        label: 'First Name',
        isActive: true,
        type: 'text',
      },
      {
        property: 'last-name',
        label: 'Last Name',
        isActive: true,
        type: 'text',
      },
      {
        property: 'updated-at',
        label: 'Last Updated',
        isActive: true,
        type: 'date',
      },
      {
        property: 'actions',
        label: 'Actions',
        isActive: true,
      },
    ];
    await render(hbs`{{ember-tabular record=model makeRequest=false columns=columns isDropdownLimit=false}}`);

    var $component = jQuery(this);
    assert.equal($component.find('thead tr:eq(0) th:eq(0)').text().trim(), 'Username', 'Table Filter - Username');
    assert.equal($component.find('thead tr:eq(0) th:eq(1)').text().trim(), 'Email', 'Table Filter - Email');
    assert.equal($component.find('thead tr:eq(0) th:eq(2)').text().trim(), 'First Name', 'Table Filter - First Name');
    assert.equal($component.find('thead tr:eq(0) th:eq(3)').text().trim(), 'Last Name', 'Table Filter - Last Name');
    assert.equal($component.find('thead tr:eq(0) th:eq(4)').text().trim(), 'Last Updated', 'Table Filter - Last Updated');
    assert.equal($component.find('thead tr:eq(0) th:eq(5)').text().trim(), 'Actions', 'Table Filter - Actions');
  });
});
