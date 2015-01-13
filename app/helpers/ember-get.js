import Ember from 'ember';
import get from './../utils/get';

export default Ember.Handlebars.makeBoundHelper(function (object, key, sub) {
  if (typeof sub !== 'string' && typeof sub !== 'number') sub= '';
  return get(object, key) || sub;
});
