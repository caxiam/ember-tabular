import { moduleForComponent, test } from 'ember-qunit';

let component;
let model = [
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
let columns = [
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

moduleForComponent('ember-tabular', 'Unit | Component | ember table jsonapi', {
  unit: true,
  needs: ['helper:dot-to-dash-filter', 'component:ember-tabular-filter', 'component:ember-tabular-registry', 'helper:and', 'component:ember-tabular-thead', 'component:pagination-pager', 'component:ember-tabular-column-select', 'component:sortable-objects', 'service:dragCoordinator', 'component:draggable-object', 'helper:compare-with', 'component:ember-tabular-column'],
  beforeEach: function() {
    component = this.subject({
      record: model,
      makeRequest: false,
      columns: columns,
      isDropdownLimit: false,
    });
  }
});

test('it renders', function(assert) {
  assert.expect(2);
  assert.equal(component._state, 'preRender', 'It pre-rendered');
  this.render();
  assert.equal(component._state, 'inDOM', 'It is in the DOM');
});

test('it displays table headers', function(assert) {
  this.render();

  var $component = this.$();
  assert.equal($component.find('thead tr:eq(0) th:eq(0)').text().trim(), 'Username', 'Table Filter - Username');
  assert.equal($component.find('thead tr:eq(0) th:eq(1)').text().trim(), 'Email', 'Table Filter - Email');
  assert.equal($component.find('thead tr:eq(0) th:eq(2)').text().trim(), 'First Name', 'Table Filter - First Name');
  assert.equal($component.find('thead tr:eq(0) th:eq(3)').text().trim(), 'Last Name', 'Table Filter - Last Name');
  assert.equal($component.find('thead tr:eq(0) th:eq(4)').text().trim(), 'Last Updated', 'Table Filter - Last Updated');
  assert.equal($component.find('thead tr:eq(0) th:eq(5)').text().trim(), 'Actions', 'Table Filter - Actions');
});
