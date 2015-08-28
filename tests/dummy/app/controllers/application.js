import Ember from 'ember'

const options = new Ember.A([
  { id: 1, name: 'Anna' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Claude' },
  { id: 4, name: 'Dennis' },
  { id: 5, name: 'Elliot' }
])
const placeholder = 'Placeholder text'

export default Ember.Controller.extend({
  options, placeholder,

  actions: {
    selectionChanged (option) {
      this.set('selected', option)
    }
  }
})
