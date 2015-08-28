import Ember from 'ember'
import layout from '../templates/components/better-select'
import removeAccents from '../utils/remove-accents'

const { computed, get, isEmpty } = Ember
const pathPrefix = 'content.'

export default Ember.Component.extend({
  layout: layout,

  classNames: ['chosen-container-single'],
  classNameBindings: ['isSearchDisabled:chosen-container-single-nosearch'],
  disableSearchThreshold: 7,

  valueLabel: computed('attrs.value', 'labelPath', {
    get() {
      const value = get(this, 'attrs.value.value')
      if (isEmpty(value)) { return false }

      const optionLabel = get(this, 'labelPath')
      return isEmpty(optionLabel) ? value : get(value, optionLabel)
    }
  }),

  displayValue: computed.or('valueLabel', 'attrs.placeholder'),

  isSearchDisabled: computed('disableSearchThreshold', 'content.[]', {
    get() {
      return get(this, 'disableSearchThreshold') > get(this, 'content.length')
    }
  }),

  labelPath: computed('attrs.optionLabelPath', {
    get() {
      const optionLabelPath = get(this, 'attrs.optionLabelPath')
      if (isEmpty(optionLabelPath)) { return false }
      return optionLabelPath.substr(pathPrefix.length)
    }
  }),

  sortedContent: computed('content', 'optionGroup', {
    get() {
      const content = get(this, 'content')
      const groupBy = get(this, 'optionGroup')
      return isEmpty(groupBy) ? content : content.sortBy(groupBy)
    }
  }),

  filteredContent: computed('labelPath', 'sortedContent', 'filter', {
    get() {
      const list = get(this, 'sortedContent')
      let filter = get(this, 'filter')
      if (isEmpty(filter)) { return list }

      filter = removeAccents(filter)
      const optionLabel = get(this, 'labelPath')
      return list.filter((item) => {
        let label = isEmpty(optionLabel) ? item : get(item, optionLabel)
        label = removeAccents(label)
        return label.indexOf(filter) !== -1
      })
    }
  }),

  actions: {
    selected(option) {
      this.sendAction('on-selection', option)
    }
  }
})
