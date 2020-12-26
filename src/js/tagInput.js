/* global _debouncer, _parseHTML, _extend */

;(function (window) {
  'use strict'

  /**
   * @param {Object} input DOM element
   * @param {Object} sets settings
   */
  function TagInput(input, sets) {
    if (!input) {
      throw new Error('TagInput: required input DOM Element')
    }

    var defaultSets = {
      suggestions: {
        src: []
      }
    }

    sets = _extend({}, defaultSets, sets)

    // Store TagInput DOM elements
    this.DOM = {
      // root
      // input
      // dropdown
    }

    // tags suggest data
    this.suggestions = {
      src: sets.suggestions.src
    }

    // suggestList config
    this.suggestList = {
      data: null
    }

    // init
    this.renderInput(input)
    this.bindEvents()
  }

  TagInput.prototype = {
    renderInput: function (input) {
      input.outerHTML =
        '<div class="tag-input"><span class="tags"></span>' +
        input.outerHTML +
        '</div>'

      this.DOM.root = document.querySelector('.tag-input')
      this.DOM.input = document.querySelector('.tag-input > input')
    },

    renderSuggestList: function (newData) {
      // no suggestions
      if (newData.length < 1) {
        if (this.DOM.dropdown && this.suggestList.data) {
          this.DOM.dropdown.innerHTML = ''
        }
      }

      // only render when data update
      if (this.compareSuggestData(newData, this.suggestList.data)) {
        return
      }

      var items = newData.map(function (item) {
        return (
          '<div class="dropdown-item"><span class="item-text">' +
          item.value +
          '</span></div>'
        )
      })

      if (!this.DOM.dropdown) {
        var list = _parseHTML('<div class="tagInput-dropdown"></div>')[0]

        this.DOM.root.appendChild(list)
        this.DOM.dropdown = list
      }

      this.DOM.dropdown.innerHTML = items.join('')
    },

    compareSuggestData: function (newData, data) {
      if (!data) {
        return false
      }

      for (var i = 0; i < newData.length; i++) {
        var newItem = newData[i]

        if (newItem.index != data[i].index) {
          return false
        }
      }

      return true
    },

    bindEvents: function () {
      var that = this
      var input = that.DOM.input

      that.onInput = _debouncer(function () {
        that.checkSuggestions(input.value)
      })

      input.removeEventListener('input', that.onInput)
      input.addEventListener('input', that.onInput)
    },

    checkSuggestions: function (value) {
      var suggestData = this.search(this.suggestions.src, value)

      this.renderSuggestList(suggestData)
    },

    search: function (data, keyword) {
      var results = []
      var word = keyword.toLowerCase()

      if (!word) {
        return results
      }

      for (var index = 0; index < data.length; index++) {
        var dataValue = data[index]
        var pattern = new RegExp(word, 'i')
        var match = pattern.exec(dataValue)

        if (match) {
          results.push({
            index: index, // use for optimize render
            match: match,
            value: dataValue
          })
        }
      }

      return results
    }
  }

  window.TagInput = window.TagInput || TagInput
})(window)
