import Ember from 'ember';

var alias = Ember.computed.alias;

var optionView = Ember.View.extend({
  tagName: 'li',
  classNameBindings: ['highlighted', 'selektor.optionGroup:group-option', 'isMultiSelected:result-selected:active-result'],
  templateName: 'components/selektor-items',
  create: Ember.computed.equal('content', '_create'),
  selektor: alias('parentView.parentView'),
  optionValue: alias('selektor.optionValue'),
  optionLabel: alias('selektor.optionLabel'),
  highlighted: function () {
    return this.get('content') === this.get('selektor.highlighted');
  }.property('selektor.highlighted'),
  isMultiSelected: function () {
    var selection = this.get('selektor.selection');
    if (selection){
      return selection.contains(this.get('content'));
    }
    else {
      return false;
    }
  }.property('selektor.selection.[]'),
  mouseEnter: function () {
    if (!this.get('isMultiSelected')){
      this.set('selektor.highlighted', this.get('content'));
    }
  },
  click: function () {
    if (!this.get('isMultiSelected')){
      Ember.run.next(this, function () {
        this.set('selektor.isShowing', false); //hide optins when value changed
      });
      this.set('selektor.selected', this.get('content'));
    }
  }
});

var emptyView = Ember.View.extend({
  tagName: 'li',
  classNames: ['no-results'],
  selektor: alias('parentView.parentView'),
  template: function (controller, data) {
    var view = data.data.view;
    var t = view.get('selektor.translation');
    if (typeof t === 'function') return t('emptySearch');
    else return 'No results';
  }
});

export default Ember.CollectionView.extend({
  itemViewClass: optionView,
  emptyView: emptyView,
});
