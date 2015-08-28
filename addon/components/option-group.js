import Ember from 'ember'
import layout from '../templates/components/option-group'

export default Ember.Component.extend({
  layout: layout,

  actions: {
    select(option) { this.sendAction('on-select', option) }
  }
})
