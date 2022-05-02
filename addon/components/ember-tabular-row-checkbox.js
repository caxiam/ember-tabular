import { isNone } from '@ember/utils';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import layout from 'ember-tabular/templates/components/ember-tabular-row-checkbox';
import jQuery from 'jquery';

export default Component.extend({
  layout,
  tagName: 'div',
  classNames: ['ember-tabular-row-checkbox'],
  // allow div to be focusable so keyDown/keyUp events are triggered
  attributeBindings: ['tabindex'],
  globals: service('ember-tabular-globals'),
  previousIndex: alias('globals.previousIndex'),
  currentIndex: alias('globals.currentIndex'),
  checked: alias('model.checked'),
  tabindex: -1,
  click(e) {
    const collection = this.collection;
    const model = this.model;
    const collectionIndex = collection.indexOf(model);

    this.set('currentIndex', collectionIndex);

    // ensure we always have a previousIndex
    if (isNone(this.previousIndex)) {
      this.set('previousIndex', collectionIndex);
    }

    let currentIndex = this.currentIndex;
    let previousIndex = this.previousIndex;

    if (e.shiftKey) {
      // ensure we set checked first
      model.toggleProperty('checked');
      if (currentIndex < previousIndex) {
        collection.slice(currentIndex, previousIndex + 1).forEach((item, index) => {
          item.set('checked', model.get('checked'));
        });
      } else {
        collection.slice(previousIndex, currentIndex + 1).forEach((item, index) => {
          item.set('checked', model.get('checked'));
        });
      }
    } else {
      this.toggleProperty('model.checked');
    }
    // always update previousIndex after actions are complete
    this.set('previousIndex', collectionIndex);
  },
  keyDown(e) {
    // disable text selection if "shift" key is pressed
    if (e.keyCode === 16) {
      jQuery(this.element).parents('tbody').addClass('unselectable');
    }
  },
  keyUp(e) {
    // re-enable text selection if "shift" key is released
    if (e.keyCode === 16) {
      jQuery(this.element).parents('tbody').removeClass('unselectable');
    }
  },
});
