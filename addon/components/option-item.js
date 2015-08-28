import Ember from 'ember'
import layout from '../templates/components/option-item'

const { computed, get } = Ember

export default Ember.Component.extend({
  tagName: 'li',
  layout: layout,

  label: computed('content', 'optionLabel', {
    get() {
      const content = get(this, 'content')
      return get(content, 'name')
    }
  }),

  click () { this.sendAction('action', get(this, 'content')) }
})
