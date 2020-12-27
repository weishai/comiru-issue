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
      // tags
    }

    // tags suggest data
    this.suggestions = {
      src: sets.suggestions.src
    }

    // suggestList config
    this.suggestList = {
      data: null
    }

    // tags data
    this.tags = {
      data: []
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
        '<div class="tagInput-dropdown"></div>' +
        '</div>'

      var root = document.querySelector('.tag-input')

      this.DOM.root = root
      this.DOM.input = root.querySelector('input')
      this.DOM.dropdown = root.querySelector('.tagInput-dropdown')
      this.DOM.tags = root.querySelector('.tags')
    },

    renderSuggestList: function (newData) {
      // no suggestions
      if (newData.length < 1) {
        if (this.suggestList.data) {
          this.DOM.dropdown.innerHTML = ''
        }
      }

      // only render when data update
      if (this.compareSuggestData(newData, this.suggestList.data)) {
        return
      }

      this.suggestList.data = newData.slice()

      console.log('renderSuggestList: render')

      var items = newData.map(function (item) {
        return (
          '<div class="dropdown-item"><span class="item-text">' +
          item.value +
          '</span></div>'
        )
      })

      this.DOM.dropdown.innerHTML = items.join('')
    },

    renderTags: function (newData) {
      var items = newData.map(function (item) {
        return '<span class="tag">' + item.value + '</span>'
      })

      this.DOM.tags.innerHTML = items.join('')
    },

    compareSuggestData: function (newData, data) {
      if (!data || newData.length != data.length) {
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
      var dropdown = that.DOM.dropdown

      that.onInput = _debouncer(function () {
        that.checkSuggestions(input.value)
      })

      input.removeEventListener('input', that.onInput)
      input.addEventListener('input', that.onInput)

      var clickEvent =
        'ontouchend' in document.documentElement === true ? 'touchend' : 'click'

      this.onDropdownTouch = function (e) {
        if (e.target.className.indexOf('dropdown-item') != -1) {
          that.updateTags('add', {
            value: e.target.textContent
          })
        }
      }

      dropdown.removeEventListener(clickEvent, this.onDropdownTouch)
      dropdown.addEventListener(clickEvent, this.onDropdownTouch)
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
    },

    updateTags: function (action, tag) {
      switch (action) {
        case 'add':
          this.tags.data.push(tag)

          break
        default:
          break
      }

      this.renderTags(this.tags.data)
    }
  }

  window.TagInput = window.TagInput || TagInput
})(window)
