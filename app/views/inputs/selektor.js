import Ember from 'ember';
import selektorMixin from './../../mixins/views/selektor';

var get = Ember.get;

export default Ember.View.extend(selektorMixin, {
  templateName: 'components/selektor',
  classNames: ['chosen-container-single'],
  classNameBindings: ['isSearchDisabled:chosen-container-single-nosearch'],
  disableSearchThreshold: 7,

  selected: function (key, selected) {
    // getter
    var option = this.get('optionValue');
    if (arguments.length === 1) {
      var value = this.get('value');
      if (value !== undefined && value !== null) {
        return this.get('content').find(function (item) {
          return get(item, option) === value;
        });
      }
    // setter
    } else {
      if (this.get('action')) {
        this.sendAction('action', selected);
      }
      this.set('value', selected && get(selected, option));
      return selected;
    }
  }.property('value'),

  isSearchDisabled: function () {
    if (this.get('disableSearchThreshold')>this.get('content.length')){
      this.set('filter', '');
      return true;
    }
    else return false;
  }.property('disableSearchThreshold', 'content.[]'),
  didInsertElement: function () {
    this._super();
    if (! (this.get('prompt') || this.get('value') || this.get('value') === false))
      this.set('selected', this.get('filteredContent')[0]);
  }
});
