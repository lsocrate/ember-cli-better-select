import Ember from 'ember'

const options = Ember.A([
  { id: 1, name: 'Anna' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Claude' },
  { id: 4, name: 'Dennis' },
  { id: 5, name: 'Elliot' }
])
const placeholder = 'Placeholder text'

export default Ember.Controller.extend({
  options, placeholder,
  singleSelected: Ember.A(),
  multiSelected: Ember.A(),

  actions: {
    singleSelection (selected) {
      this.set('singleSelected', selected)
    },
    multiSelection (selected, allSelected) {
      this.set('multiSelected', allSelected)
    }
  }
})
