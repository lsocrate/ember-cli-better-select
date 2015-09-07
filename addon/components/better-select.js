import Ember from 'ember'
import layout from '../templates/components/better-select'
import removeAccents from '../utils/remove-accents'

const { $, computed, get, isArray, isEmpty, observer, run, set, setProperties } = Ember
const pathPrefix = 'content.'

const selectedItems = Ember.ArrayProxy.extend({
  objectAtContent (idx) {
    const labelPath = get(this, 'labelPath')
    const item = get(this, 'content').objectAt(idx)
    const label = isEmpty(labelPath) ? item : get(item, labelPath)
    return { item, label }
  }
})

export default Ember.Component.extend({
  layout,

  classNames: ['chosen-container'],
  classNameBindings: [
    'isMulti:chosen-container-multi:chosen-container-single',
    'isSearchDisabled:chosen-container-single-nosearch',
    'isShowing:chosen-with-drop',
    'isShowing:chosen-container-active'
  ],
  disableSearchThreshold: 7,

  isMulti: computed.alias('attrs.multiple'),
  isOpen: false,

  selectedItems: computed('attrs.selected.value', 'attrs.selected.value.[]', 'labelPath', {
    get() {
      let content = get(this, 'attrs.selected.value')
      if (isEmpty(content)) { return [] }
      if (!isArray(content)) { content = Ember.A([ content ]) }

      const labelPath = get(this, 'labelPath')
      return selectedItems.create({ content, labelPath })
    }
  }),

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

  click (ev) {
    if (!get(this, 'isShowing')) {
      this.$('input.search').focus()
    } else {
      const clickedInput = ev.target.tagName === 'INPUT'
      const display = this.$('.chosen-display')[0]
      const clickedInsideElement = display === ev.target || $.contains(display, ev.target)
      if (clickedInput && clickedInsideElement) {
        set(this, 'isShowing', false)
      }
    }
  },
  focusIn () { setProperties(this, { filter: '', isShowing: true }) },
  controlCloseEvent: observer('isShowing', function () {
    const isShowing = get(this, 'isShowing')
    const handlerName = `click.${this.elementId}`
    if (!isShowing) {
      $(document).off(handlerName)
    } else {
      $(document).on(handlerName, (ev) => {
        run(this, function () {
          const clickedInsideElement = $.contains(this.element, ev.target)
          const clickedSearchPlaceholder = ev.target.className === 'search-placeholder'
          set(this, 'isShowing', clickedInsideElement || clickedSearchPlaceholder)
        })
      })
    }
  }),

  actions: {
    selected(option) {
      const selected = Ember.A([ option ])

      if (get(this, 'isMulti')) {
        const content = get(this, 'attrs.selected.value')
        if (!isEmpty(content)) {
          selected.addObjects(content)
        }
      }

      this.sendAction('on-selection', option, selected)
    }
  }
})
