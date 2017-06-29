import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

let record = [
  {
    id: 1,
    username: 'YippieKiYay',
    emailAddress: 'john.mcclane@domain.com',
    firstName: 'John',
    lastName: 'McClane',
    isAdmin: true,
    createdAt: '2017-01-01',
    updatedAt: '2017-01-02'
  },
  {
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
    defaultSort: 'username',
  },
  {
    property: 'emailAddress',
    label: 'Email',
    isActive: true,
  },
  {
    property: 'firstName',
    label: 'First Name',
    isActive: true,
  },
  {
    property: 'lastName',
    label: 'Last Name',
    isActive: true,
  },
  {
    property: 'isAdmin',
    label: 'Is Admin',
    isActive: true,
    list: [
      {
        label: 'Yes',
        id: true,
      },
      {
        label: 'No',
        id: false,
      }
    ],
  },
  {
    property: 'updatedAt',
    label: 'Last Updated',
    isActive: true,
    type: 'date',
  },
  {
    property: 'actions',
    label: 'Actions',
    isActive: true,
    filter: false,
    sort: false,
  },
];
let columnsLabels = [
  {
    label: 'Username',
    isActive: true,
  },
  {
    label: 'Email',
    isActive: true,
  },
  {
    label: 'First Name',
    isActive: true,
  },
  {
    label: 'Last Name',
    isActive: true,
  },
  {
    label: 'Last Updated',
    isActive: true,
  },
];
let columnsNoFilter = [
  {
    property: 'username',
    label: 'Username',
    isActive: false,
    filter: false,
  },
  {
    property: 'emailAddress',
    label: 'Email',
    isActive: true,
    filter: false,
  },
  {
    property: 'firstName',
    label: 'First Name',
    isActive: true,
    filter: false,
  },
  {
    property: 'lastName',
    label: 'Last Name',
    isActive: true,
    filter: false,
  },
  {
    property: 'updatedAt',
    label: 'Last Updated',
    isActive: true,
    filter: false,
  },
];

moduleForComponent('ember-tabular', 'Integration | Component | ember table jsonapi', {
  integration: true,
});

test('Render header yield', function(assert) {
  this.set('columns', columns);
  this.render(hbs`
    {{#ember-tabular columns=columns record=record makeRequest=false as |section|}}
      {{#if section.isHeader}}
        <div class="header">
          Test Header Yield
        </div>
      {{/if}}
    {{/ember-tabular}}
  `);

  var $component = this.$();
  assert.equal($component.find('.header').text().trim(), 'Test Header Yield');
});

test('Render body yield', function(assert) {
  this.set('columns', columns);
  this.render(hbs`
    {{ember-tabular columns=columns record=record makeRequest=false isDropdownLimit=false}}
  `);
  // Set record after render b/c of component this.reset()
  this.set('record', record);

  var $component = this.$();
  assert.equal($component.find('tbody tr:eq(0) td:eq(0)').text().trim(), 'YippieKiYay');
});

test('Render footer yield', function(assert) {
  this.set('columns', columns);
  this.render(hbs`
    {{#ember-tabular columns=columns record=record makeRequest=false as |section|}}
      {{#if section.isFooter}}
        <div class="footer">
          Test Footer Yield
        </div>
      {{/if}}
    {{/ember-tabular}}
  `);

  var $component = this.$();
  assert.equal($component.find('.footer').text().trim(), 'Test Footer Yield');
});

test('Render filter component', function(assert) {
  this.set('columns', columns);
  this.render(hbs`
    {{#ember-tabular columns=columns record=record makeRequest=false as |section|}}
      {{#if section.isFooter}}
        ...
      {{/if}}
    {{/ember-tabular}}
  `);

  var $component = this.$();
  // show .btn-toggle-filter to show filter row
  $component.find('thead .btn-toggle-filter:eq(0)').click();
  assert.equal($component.find('thead tr:eq(1) th:eq(0) input').length, 1, 'Table Filter Input - Username');
  assert.equal($component.find('thead tr:eq(1) th:eq(1) input').length, 1, 'Table Filter Input - Email');
  assert.equal($component.find('thead tr:eq(1) th:eq(2) input').length, 1, 'Table Filter Input - First Name');
  assert.equal($component.find('thead tr:eq(1) th:eq(3) input').length, 1, 'Table Filter Input - Last Name');
  assert.equal($component.find('thead tr:eq(1) th:eq(4) .ember-power-select-trigger').length, 1, 'Table Filter Input - Is Admin');
  assert.equal($component.find('thead tr:eq(1) th:eq(5) input').length, 1, 'Table Filter Input - Last Updated');
  assert.equal($component.find('thead tr:eq(1) th:eq(6) input').length, 0, 'Table Filter No Input - Actions');
});

test('Do not render filter component', function(assert) {
  this.set('columnsLabels', columnsLabels);
  this.render(hbs`
    {{#ember-tabular columns=columnsLabels record=record makeRequest=false as |section|}}
      {{#if section.isFooter}}
        ...
      {{/if}}
    {{/ember-tabular}}
  `);

  var $component = this.$();
  assert.equal($component.find('thead tr').length, 1, 'Do not render filter row');
});

test('Render global filter component', function(assert) {
  this.set('columns', columns);
  this.render(hbs`
    {{#ember-tabular columns=columns record=record makeRequest=false filter=filter as |section|}}
      {{#if section.isHeader}}
        {{ember-tabular-global-filter filter=filter filterProperty="username" filterPlaceholder="Search by Username"}}
      {{/if}}
    {{/ember-tabular}}
  `);

  var $component = this.$();
  assert.equal($component.find('.table-filter').length, 1, 'Test global filter');
});

test('Render dropdown filter component', function(assert) {
  this.set('columns', columns);
  this.render(hbs`
    {{#ember-tabular columns=columns record=record makeRequest=false filter=filter as |section|}}
      {{#if section.isHeader}}
        {{#ember-tabular-dropdown-filter filter=filter filterProperty="isAdmin" filterPlaceholder="Filter by Admin"}}
          ...
        {{/ember-tabular-dropdown-filter}}
      {{/if}}
    {{/ember-tabular}}
  `);

  var $component = this.$();
  assert.equal($component.find('.table-filter').length, 2, 'Test global filter');
  assert.equal($component.find('.table-filter .search-filter').length, 1, 'Test ember power select loads within global filter');
});

test('Render column select component', function(assert) {
  this.set('columns', columns);
  this.render(hbs`
    {{ember-tabular columns=columns record=record makeRequest=false}}
  `);

  var $component = this.$();
  assert.equal($component.find('.btn-group-column-select').length, 1, 'Column select renders');
  assert.equal($component.find('.btn-group-column-select li').length, 7, 'Column select renders columns in a list');
});

test('Render isLoading class on component', function(assert) {
  this.set('columns', columns);
  this.render(hbs`
    {{#ember-tabular columns=columns record=record makeRequest=false isLoading="true" as |section|}}
      {{#if section.isBody}}
        ...
      {{/if}}
    {{/ember-tabular}}
  `);

  var $component = this.$();
  assert.equal($component.find('.table').hasClass('loading'), true, 'Table has class loading');
});

test('Render dropdown limit component', function(assert) {
  this.set('columns', columns);
  this.render(hbs`
    {{#ember-tabular columns=columns record=record makeRequest=false filter=filter isDropdownLimit=true as |section|}}
      ...
    {{/ember-tabular}}
  `);

  var $component = this.$();
  assert.equal($component.find('.ember-tabular-dropdown-limit').length, 1, 'Test if ember-tabular-dropdown-limit exists');
});

test('Do not render dropdown limit component', function(assert) {
  this.set('columns', columns);
  this.render(hbs`
    {{#ember-tabular columns=columns record=record makeRequest=false filter=filter isDropdownLimit=false as |section|}}
      ...
    {{/ember-tabular}}
  `);

  var $component = this.$();
  assert.equal($component.find('.ember-tabular-dropdown-limit').length, 0, 'Test if ember-tabular-dropdown-limit exists');
});

test('Do not render column filters', function(assert) {
  this.set('columnsNoFilter', columnsNoFilter);
  this.render(hbs`
    {{#ember-tabular columns=columnsNoFilter record=record makeRequest=false as |section|}}
      ...
    {{/ember-tabular}}
  `);

  var $component = this.$();
  assert.equal($component.find('thead tr').length, 1, 'Do not render filter row');
  assert.equal($component.find('thead tr th:eq(0)').attr('class'), 'sortable ', 'Filterable class is missing from columns');
  assert.equal($component.find('thead tr th:eq(0) .btn-toggle-filter').length, 0, 'Do not render column filter');
});

test('Do not render specific column', function(assert) {
  this.set('columnsNoFilter', columnsNoFilter);
  this.render(hbs`
    {{ember-tabular columns=columnsNoFilter record=record makeRequest=false isDropdownLimit=false}}
  `);
  // Set record after render b/c of component this.reset()
  this.set('record', record);

  var $component = this.$();
  assert.equal($component.find('thead tr th:eq(0)').text().trim(), 'Email', 'Email is the first column, not Username');
  assert.equal($component.find('thead tr th').length, 4, 'Username is hidden, only 4 columns are rendering');
  assert.equal($component.find('tbody tr:eq(0) td').length, 4, 'Tbody columns match the thead columns, username is hidden');
});
