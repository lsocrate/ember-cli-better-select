import Ember from 'ember';

export default Ember.Handlebars.makeBoundHelper(function (object, key, sub) {
  if (typeof sub !== 'string' && typeof sub !== 'number') sub= '';
  return (object && Ember.get(object, key)) || sub;
});
