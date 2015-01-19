import Ember from 'ember';
import cleanString from './../../utils/accents-remover';
import {getKey} from './../../utils/key-events';

function centerHighlighted (view){
  var index = view.get('index');
  view.$('ul.chosen-results').scrollTop(view.$('.chosen-results li').outerHeight()*(index-1));
}

export default Ember.Mixin.create({
  classNames: ['chosen-container'],
  classNameBindings: ['isShowing:chosen-with-drop'],
  optionValuePath: 'content',
  optionLabelPath: 'content',
  isShowing: false,
  index: 0,
  translation: undefined,

  highlighted: function (key, item) {
    // getter
    if (arguments.length === 1) {
      return this.get('filteredContent')[this.get('index')];
    // setter
    } else {
      this.set('index', this.get('filteredContent').indexOf(item));
      return item;
    }
  }.property('filteredContent', 'index'),

  placeholder: function (){
    var t = this.get('translation');
    if (t){
      return t(this.get('prompt'));
    }
    else{
      return this.get('prompt');
    }

  }.property('prompt', 'translation'),

  optionValue: function () {
    if (this.get('optionValuePath'))
      return this.get('optionValuePath').replace(/^content\.?/, '');
  }.property('optionValuePath'),
  optionLabel: function () {
    if (this.get('optionLabelPath'))
      return this.get('optionLabelPath').replace(/^content\.?/, '');
  }.property('optionLabelPath'),
  optionGroup: function () {
    if (this.get('optionGroupPath'))
      return this.get('optionGroupPath').replace(/^content\.?/, '');
  }.property('optionGroupPath'),

  focusIn: function () {
    this.set('filter', '');
    this.set('isShowing', true);
  },
  click: function (e) { //clicked to open
    if (!this.get('isShowing')) this.$('input.search').focus();
    else {
      var clickedOnSelketorDisplay = e.target.tagName !== 'INPUT' && ($.contains(this.$('.chosen-display')[0], e.target) || this.$('.chosen-display')[0] === e.target);
      if (clickedOnSelketorDisplay) this.set('isShowing', false);
    }
  },

  resolveContent: function () {
    var content = this.get('content');
    console.log(content);
    if (content.then){
      content.then(resolved => {
        this.set('resolvedContent', resolved);
        console.log(resolved);
      });
    }
    else{
      this.set('resolvedContent', content);
    }
  }.observes('content').on('init'),
  resolvedContent: null,

  sortedContent: function () {
    var group = this.get('optionGroup');
    if (group) return this.get('resolvedContent').sortBy(group);
    else return this.get('resolvedContent');
  }.property('resolvedContent', 'optionGroup'),

  filteredContent: function () {
    var filter = this.get('filter');
    var list = Ember.A(this.get('sortedContent'));
    this.set('index', 0);
    if(filter){
      list = list.filter(function (item){
        var aux;
        if (this.get('optionLabel')) aux = Ember.get(item, this.get('optionLabel'));
        else aux = item;
        return cleanString(aux).indexOf(cleanString(filter)) !== -1;
      }.bind(this));
    }
    return list;
  }.property('sortedContent', 'filter'),

  groupedContent: function () {
    var list = Ember.A();
    _.forIn(_.groupBy(this.get('filteredContent'), this.get('optionGroup')), function (value, key){
      list.addObject({group: key, list: value});
    });
    return list;
  }.property('filteredContent', 'optionGroup'),

  keyDown: function (e){
    var index = this.get('index');
    var key = getKey(e);
    if (this.get('isShowing')){
      switch (key){
        case 'Down':
          if (index<this.get('filteredContent.length') - 1) this.nextItem();
          centerHighlighted(this);
          break;
        case 'Up':
          if (index>0) this.prevItem();
          centerHighlighted(this);
          break;
        case 'Enter':
          e.preventDefault(); //just on the enter to let the user type
          if (this.get('filteredContent.length')){
            this.set('selected', this.get('filteredContent')[index]);
            this.set('isShowing', false);
          }
          break;
        case 'Tab':
          if (this.get('filteredContent.length')){
            this.set('selected', this.get('filteredContent')[index]);
            this.set('isShowing', false);
          }
          break;
        case 'Esc':
          this.set('selected', null);
          this.set('isShowing', false);
          this.set('filter', '');
          break;
      }
    }
    else{
      if (key !== 'Tab' && key !== 'Esc') this.set('isShowing', true);
    }
  },

  nextItem: function () {
    this.incrementProperty('index');
  },

  prevItem: function () {
    this.decrementProperty('index');
  },

  didInsertElement: function () {
    $('body').on('click.' + this.elementId, function (e) {
      Ember.run(this, function (){
        var instanceExists = this.$() && this.$()[0];
        if (!instanceExists) {
          return;
        }
        var containsTarget = $.contains(this.$()[0], e.target);
        var targetedSearch = e.target.className === 'search-placeholder';
        var clickedSelektor = containsTarget || targetedSearch;
        if (!clickedSelektor) {
          return this.set('isShowing', false);
        }
      });
    }.bind(this));
  },
  willDestroyElement: function () {
    $('body').off('click.' + this.elementId);
  },
  createNameChanged: function () {
    this.set('createError', false);
  }.observes('createName'),
  actions:{
    sendCreate: function () {
      this.get('parentView.controller').send(this.get('createAction'), this.get('createName'));
      this.set('createName', '');
    }
  }
});
