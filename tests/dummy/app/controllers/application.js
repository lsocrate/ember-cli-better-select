import Ember from 'ember';

export default Ember.Controller.extend({
  testContent: [
    {id: 1, name: 'Anna'},
    {id: 2, name: 'Bob'},
    {id: 3, name: 'Claude'},
    {id: 4, name: 'Denis'},
    {id: 5, name: 'Eric'}
  ],
  actions:{
    change: function (value) {
      console.log(value);
    }
  }
});
