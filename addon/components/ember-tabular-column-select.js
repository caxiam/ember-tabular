import Ember from 'ember';
import layout from 'ember-tabular/templates/components/ember-tabular-column-select';

/**
* Generates a bootstrap compliant dropdown containing the `columns`
* in a selectable/reorderable list.
*
* @class EmberTabularColumnSelect
*/
export default Ember.Component.extend({
  layout,
  /**
  * @property tagName
  * @type String
  * @default 'div'
  */
  tagName: 'div',
  classNames: ['btn-group', 'btn-group-column-select', 'dropup'],
  columns: null,
  btnCopy: 'Columns',
  useIcon: true,

  actions: {
    toggleColumn(column) {
      if (column.isActive) {
        Ember.set(column, 'isActive', false);
      } else {
        Ember.set(column, 'isActive', true);
      }
    },
    sortEndAction() {
      // override to perform custom actions on end of sort
      // perhaps to save the columns order
    },
  },
});
