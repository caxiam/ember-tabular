import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

let bindModel = [
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
        type: 'text',
        defaultSort: 'username',
    },
    {
        property: 'email-address',
        label: 'Email',
        type: 'text',
    },
    {
        property: 'first-name',
        label: 'First Name',
        type: 'text',
    },
    {
        property: 'last-name',
        label: 'Last Name',
        type: 'text',
    },
    {
        property: 'updated-at',
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

moduleForComponent('ember-table-jsonapi', 'Integration | Component | ember table jsonapi', {
    integration: true,
});

test('Render header yield', function(assert) {
    this.set('columns', columns);
    this.render(hbs`
        {{#ember-table-jsonapi columns=columns bindModel=bindModel hasActions="true" as |section|}}
            {{#if section.isHeader}}
                <div class="header">
                    Test Header Yield
                </div>
            {{/if}}
        {{/ember-table-jsonapi}}
    `);

    var $component = this.$();
    assert.equal($component.find('.header').text().trim(), 'Test Header Yield');
});

test('Render body yield', function(assert) {
    this.set('columns', columns);
    this.render(hbs`
        {{#ember-table-jsonapi columns=columns bindModel=bindModel hasActions="true" as |section|}}
            {{#if section.isBody}}
                <div class="body">
                    Test Body Yield
                </div>
            {{/if}}
        {{/ember-table-jsonapi}}
    `);
    // Set bindModel after render b/c of component this.reset()
    this.set('bindModel', bindModel);

    var $component = this.$();
    assert.equal($component.find('.body').text().trim(), 'Test Body Yield');
});

test('Render footer yield', function(assert) {
    this.set('columns', columns);
    this.render(hbs`
        {{#ember-table-jsonapi columns=columns bindModel=bindModel hasActions="true" as |section|}}
            {{#if section.isFooter}}
                <div class="footer">
                    Test Footer Yield
                </div>
            {{/if}}
        {{/ember-table-jsonapi}}
    `);

    var $component = this.$();
    assert.equal($component.find('.footer').text().trim(), 'Test Footer Yield');
});

test('Render filter component', function(assert) {
    this.set('columns', columns);
    this.render(hbs`
        {{#ember-table-jsonapi columns=columns bindModel=bindModel hasActions="true" as |section|}}
            {{#if section.isFooter}}
                ...
            {{/if}}
        {{/ember-table-jsonapi}}
    `);

    var $component = this.$();
    assert.equal($component.find('thead tr:eq(1) th:eq(0) input').length, 1, 'Table Filter Input - Username');
    assert.equal($component.find('thead tr:eq(1) th:eq(1) input').length, 1, 'Table Filter Input - Email');
    assert.equal($component.find('thead tr:eq(1) th:eq(2) input').length, 1, 'Table Filter Input - First Name');
    assert.equal($component.find('thead tr:eq(1) th:eq(3) input').length, 1, 'Table Filter Input - Last Name');
    assert.equal($component.find('thead tr:eq(1) th:eq(4) input').length, 1, 'Table Filter Input - Last Updated');
    assert.equal($component.find('thead tr:eq(1) th:eq(5) input').length, 0, 'Table Filter No Input - Actions');
});

test('Do not render filter component', function(assert) {
    this.set('columnsLabels', columnsLabels);
    this.render(hbs`
        {{#ember-table-jsonapi columns=columnsLabels bindModel=bindModel hasActions="true" as |section|}}
            {{#if section.isFooter}}
                ...
            {{/if}}
        {{/ember-table-jsonapi}}
    `);

    var $component = this.$();
    assert.equal($component.find('thead tr').length, 1, 'Do not render filter row');
});

test('Render global filter component', function(assert) {
    this.set('columns', columns);
    this.render(hbs`
        {{#ember-table-jsonapi columns=columns bindModel=bindModel searchable="true" hasActions="true" as |section|}}
            {{#if section.isFooter}}
                ...
            {{/if}}
        {{/ember-table-jsonapi}}
    `);

    var $component = this.$();
    assert.equal($component.find('.table-filter').length, 1, 'Test global filter');
});
