import Ember from 'ember';
import selektorMixin from './../../mixins/views/selektor';

var get = Ember.get;

export default Ember.View.extend(selektorMixin, {
  templateName: 'components/selektor',
  classNames: ['chosen-container-single'],
  classNameBindings: ['isSearchDisabled:chosen-container-single-nosearch'],
  disableSearchThreshold: 7,

  findItem: function (value, option) {
    return this.get('content').find(function (item) {
      //using ember array to compare 2 objects
      //because you cant compare 2 objects with ===
      var list = [get(item, option)];
      list.addObject(value); //if they are the same its not added
      return list.get('length') === 1;
    });
  },

  selected: function (key, selected) {
    // getter
    var option = this.get('optionValue');
    if (arguments.length === 1) {
      var value = this.get('value');
      if (value !== undefined && value !== null) {
        if (this.get('value').then){ //its because when using models the return is a promise
          var promise = this.get('value').then(function (value) {
            return this.findItem(value, option);
          }.bind(this));
          return Ember.ObjectProxy.extend(Ember.PromiseProxyMixin).create({
            promise: promise //makes a proxy that resolves the promise
          });
        }
        else{
          return this.findItem(value, option);
        }
      }
    // setter
    } else {
      if (this.get('action')) {
        this.get('controller').send(this.get('action'), selected);
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
