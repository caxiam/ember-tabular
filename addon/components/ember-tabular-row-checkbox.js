import Ember from 'ember';
import layout from 'ember-tabular/templates/components/ember-tabular-row-checkbox';

export default Ember.Component.extend({
  layout,
  tagName: 'div',
  classNames: ['ember-tabular-row-checkbox'],
  // allow div to be focusable so keyDown/keyUp events are triggered
  attributeBindings: ['tabindex'],
  globals: Ember.inject.service('ember-tabular-globals'),
  previousIndex: Ember.computed.alias('globals.previousIndex'),
  currentIndex: Ember.computed.alias('globals.currentIndex'),
  checked: Ember.computed.alias('model.checked'),
  tabindex: -1,
  click(e) {
    const collection = this.get('collection');
    const model = this.get('model');
    const collectionIndex = collection.indexOf(model);

    this.set('currentIndex', collectionIndex);

    // ensure we always have a previousIndex
    if (Ember.isNone(this.get('previousIndex'))) {
      this.set('previousIndex', collectionIndex);
    }

    let currentIndex = this.get('currentIndex');
    let previousIndex = this.get('previousIndex');

    if (e.shiftKey) {
      if (currentIndex < previousIndex) {
        collection.slice(currentIndex, previousIndex + 1).setEach('checked', this.toggleProperty('model.checked'));
      } else {
        collection.slice(previousIndex, currentIndex + 1).setEach('checked', this.toggleProperty('model.checked'));
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
      this.$().parents('tbody').addClass('unselectable');
    }
  },
  keyUp(e) {
    // re-enable text selection if "shift" key is released
    if (e.keyCode === 16) {
      this.$().parents('tbody').removeClass('unselectable');
    }
  },
});
