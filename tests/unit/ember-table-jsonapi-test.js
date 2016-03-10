import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

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

moduleForComponent('ember-table-jsonapi', 'Unit | Component | ember table jsonapi', {
    unit: true,
    needs: ['helper:dot-to-dash-filter', 'component:ember-table-jsonapi-filter', 'helper:and', 'component:pagination-pager'],
    beforeEach: function() {
        component = this.subject({
            bindModel: model,
            columns: columns,
            hasActions: 'true',
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

test('it displays table header filters', function(assert) {
    this.render(hbs`
        {{#ember-table-jsonapi columns=columns bindModel=model hasActions="true" as |section|}}
            {{#if section.isBody}}
                {{#each users as |row|}}
                    <tr>
                        <td>{{row.username}}</td>
                        <td>{{row.emailAddress}}</td>
                        <td>{{row.firstName}}</td>
                        <td>{{row.lastName}}</td>
                        <td>
                            {{#if row.updatedAt}}
                                {{moment-format row.updatedAt 'MM/DD/YYYY'}}
                            {{else}}
                                {{moment-format row.createdAt 'MM/DD/YYYY'}}
                            {{/if}}
                        </td>
                        <td>
                            {{#link-to "index" class="btn btn-default btn-xs" role="button"}}
                                Edit
                            {{/link-to}}
                        </td>
                    </tr>
                {{/each}}
            {{/if}}
        {{/ember-table-jsonapi}}
    `);

    var $component = this.$();

    // TODO write test to check column input filter
    assert.equal($component.find('thead tr:eq(1) th:eq(0)').text().trim(), 'Username', 'Table Filter - Username');
});
