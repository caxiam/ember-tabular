import Ember from 'ember';

/**
* Filtering on a column by column basis within the component's `<table/>`.
*
* @class EmberTabularFilter
*/
export default Ember.Component.extend({
  /**
  * @property tagName
  * @type String
  * @default 'th'
  */
  tagName: 'th',
  action: null,
  /**
  * Value of filter.
  *
  * @property headerFilter
  * @type String
  * @default ''
  */
  headerFilter: '',

  /**
  * Pass the `query` object from the parent component if it is different or if used outside of the context of the component, otherwise `query` is optional and the component will attempt to grab within the context of the parent component.
  *
  * @property query
  * @type Object
  * @default null
  */
  query: null,
  /**
  * Must expose the `filter` property on the parent ember-tabular component to be able to pass the filter object back and forth between parent and child components.
  *
  * @property filter
  * @type Object
  * @default null
  */
  filter: null,

  actions: {
    clearFilter() {
      this.set('headerFilter', '');
    },
    setHeaderFilter(object) {
      if (object) {
        this.set('headerFilter', object.value);
      } else {
        this.set('headerFilter', null);
      }
    },
  },
  /**
  * Debounce the `filterName` method.
  *
  * @method filterBy
  */
  filterBy: Ember.observer('headerFilter', function () {
    Ember.run.debounce(this, 'filterName', 750);
  }),
  /**
  * @property isClearable
  */
  isClearable: Ember.computed('headerFilter', function () {
    if (this.get('headerFilter')) {
      return true;
    }
    return false;
  }),
  /**
  * @property inputPlaceholder
  */
  inputPlaceholder: Ember.computed('header.type', function () {
    const type = this.get('header.type');

    if (type === 'date') {
      return 'YYYY-MM-DD';
    }
  }),
  setupDateTimePicker: Ember.on('didInsertElement', function () {
    const type = this.get('header.type');
    if (type === 'date') {
      let element = this.get('element');
      Ember.$(element).find('input').datetimepicker({
        widgetParent: 'body',
        format: 'YYYY-MM-DD',
        viewMode: 'years',
      }).on('dp.show', function() {
        // fix positioning bug when picker is within overflow:hidden container
        let datepicker = Ember.$('body').find('.bootstrap-datetimepicker-widget:last');
        if (datepicker.hasClass('bottom')) {
          let top = Ember.$(this).offset().top + Ember.$(this).outerHeight();
          let left = Ember.$(this).offset().left;
          datepicker.css({
            top: `${top}px`,
            bottom: 'auto',
            left: `${left}px`,
          });
        } else if (datepicker.hasClass('top')) {
          let top = Ember.$(this).offset().top - datepicker.outerHeight();
          let left = Ember.$(this).offset().left;
          datepicker.css({
            top: `${top}px`,
            bottom: 'auto',
            left: `${left}px`,
          });
        }
      });
    }
  }),
  /**
  * Constructs and sets the `filter` Object.
  *
  * @method filterName
  */
  filterName() {
    const query = this.get('query');
    const property = this.get('property');
    const value = this.get('headerFilter');
    let filter;

    // Set the query on the filter object
    if (query && query.hasOwnProperty('filter') && query.filter !== null) {
      filter = this.get('query.filter');
    } else {
      filter = {};
    }
    filter[property] = value;

    // Remove filter if value is an empty string
    // to prevent empty request from being sent
    if (value === '' || value === null) {
      delete filter[property];
    }

    // Take filter object and break into different format
    // filters = [{field: 'name', value:'foo'}, {field: 'email', value: 'foo@bar.com'}];
    const filters = Object.keys(filter).map(function (key) {
      return {
        field: key,
        value: filter[key],
      };
    });

    // Trigger 'setModel'
    if (!this.isDestroyed || !this.isDestroying) {
      this.set('filter', filters);
    }
  },
});
