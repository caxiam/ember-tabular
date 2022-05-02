import { set } from '@ember/object';
import Component from '@ember/component';
import layout from 'ember-tabular/templates/components/ember-tabular-column-select';
import jQuery from 'jquery';

/**
* Generates a bootstrap compliant dropdown containing the `columns`
* in a selectable/reorderable list.
*
* @class EmberTabularColumnSelect
*/
export default Component.extend({
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
  saveColumns: undefined,

  didInsertElement() {
    this._super(...arguments);
    // prevent dropdown from closing when clicking within
    jQuery(this.element).on({
      'click': function(e) {
        if ($(e.target).closest('.dropdown-toggle').length) {
          $(this).data('closable', true);
        } else {
          $(this).data('closable', false);
        }
      },
      'hide.bs.dropdown': function(e) {
        let hide = $(this).data('closable');
        $(this).data('closable', true);
        return hide;
      }
    });
  },

  actions: {
    toggleColumn(column) {
      if (column.isActive) {
        set(column, 'isActive', false);
      } else {
        set(column, 'isActive', true);
      }
      // fire action to saveColumns
      this.saveColumns();
    },
    sortEndAction() {
      // override to perform custom actions on end of sort
      // perhaps to save the columns order
      // fire action to saveColumns
      this.saveColumns();
    },
  },
});
