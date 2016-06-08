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
    defaultSort: 'username',
  },
  {
    property: 'emailAddress',
    label: 'Email',
  },
  {
    property: 'firstName',
    label: 'First Name',
  },
  {
    property: 'lastName',
    label: 'Last Name',
  },
  {
    property: 'isAdmin',
    label: 'Is Admin',
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
    type: 'date',
  },
];
let columnsLabels = [
  {
    label: 'Username',
  },
  {
    label: 'Email',
  },
  {
    label: 'First Name',
  },
  {
    label: 'Last Name',
  },
  {
    label: 'Last Updated',
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
    {{#ember-tabular columns=columns record=record makeRequest=false as |section|}}
      {{#if section.isBody}}
        <div class="body">
          Test Body Yield
        </div>
      {{/if}}
    {{/ember-tabular}}
  `);
  // Set record after render b/c of component this.reset()
  this.set('record', record);

  var $component = this.$();
  assert.equal($component.find('.body').text().trim(), 'Test Body Yield');
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
  assert.equal($component.find('thead tr:eq(1) th:eq(4) .ember-power-select').length, 1, 'Table Filter Input - Is Admin');
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
