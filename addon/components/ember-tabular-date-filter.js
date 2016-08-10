import EmberTabularGlobalFilter from './ember-tabular-global-filter';

export default EmberTabularGlobalFilter.extend({
  setupDateTimePicker: Ember.on('didInsertElement', Ember.observer('searchFilter', function () {
    const element = this.get('element');
    const emberTabular = this;

    let picker = Ember.$(element).find('input').pickadate({
      selectMonths: true,
      selectYears: true,
      format: 'mm/dd/yyyy',
      onSet() {
        Ember.set(emberTabular, 'searchFilter', this.get('select', 'yyyy-mm-dd'));
      },
    }).pickadate('picker');

    // ensure clearFilter action clears pickadate input/object
    if (picker && !emberTabular.get('searchFilter')) {
      picker.clear();
    }
  })),
});
