import Ember from 'ember';
import selektorMixin from './../../mixins/views/selektor';
import {getKey} from './../../utils/key-events';

export default Ember.View.extend(selektorMixin, {
  templateName: 'components/multi-selektor',
  classNames: ['chosen-container-multi'],
  classNameBindings: ['isFocus:chosen-container-active'],
  value: Ember.A(),
  selection: Ember.computed.alias('value'), //to maintain Ember select standards

  focusIn: function (){
    this._super.apply(this, arguments);
    this.set('isFocus', true);
  },
  focusOut: function (){
    this._super.apply(this, arguments);
    this.set('isFocus', false);
  },

  selected: function (key, selected) {
    // setter, dont need the getter, because its only to add
    if (arguments.length > 1){
      this.set('filter', '');
      if (this.get('action')) {
        this.get('controller').send(this.get('action'), selected);
      }
      if (selected !== null){
        if (this.get('value.length')>0){
          this.get('value').addObject(selected);
        }
        else {
          this.set('value', Ember.A([selected]));
        }
      }
    }
  }.property(),

  keyDown: function(e) {
    if (getKey(e) === 'Backspace' && this.get('filter') === '' && this.get('value.length')){
      this.get('value').popObject();
      this.set('isShowing', false);
    }
    this._super(e);
  },

  nextItem: function (){
    var index = this.get('index') + 1;
    var filtered = this.get('filteredContent') || Ember.A();
    var value = this.get('value') || Ember.A();
    while (index <= filtered.get('length')){
      if (!value.contains(filtered[index])){
        return this.set('index', index);
      }
      index ++;
    }
  },

  prevItem: function (){
    var index = this.get('index') - 1;
    var filtered = this.get('filteredContent') || Ember.A();
    var value = this.get('value') || Ember.A();
    while (index >= 0){
      if (!value.contains(filtered[index])){
        return this.set('index', index);
      }
      index --;
    }
  },

  actions:{
    remove: function (selected) {
      this.get('value').removeObject(selected);
    }
  }
});
