import Ember from 'ember';
export default function get (obj, key) {
  if (key){
    return Ember.get(obj, key);
  }
  else{
    return obj;
  }
}
