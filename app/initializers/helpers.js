import Ember from 'ember';
import selektor from './../views/inputs/selektor';

export default {
  name: 'helpers',
  initialize: function () {
    Ember.Handlebars.helper('selektor', selektor);
  }
};
