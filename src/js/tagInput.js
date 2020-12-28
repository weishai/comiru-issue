/* global _debouncer, _delegate, _extend */

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
      data: [],
      indexs: []
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
      if (
        this.DOM.dropdown.className.indexOf('show') != -1 &&
        this.compareSuggestData(newData, this.suggestList.data)
      ) {
        // console.log('renderSuggestList no render')

        return
      }

      this.suggestList.data = newData.slice()

      // console.log('renderSuggestList: render')

      var items = newData.map(function (item) {
        return (
          '<div class="dropdown-item" data-index="' +
          item.index +
          '" data-value="' +
          item.value +
          '"><span class="item-text">' +
          item.value +
          '</span></div>'
        )
      })

      this.DOM.dropdown.innerHTML = items.join('')
      this.DOM.dropdown.classList.add('show')
    },

    renderTags: function (newData) {
      var items = newData.map(function (item) {
        return (
          '<span class="tag" data-index="' +
          item.index +
          '" data-value="' +
          item.value +
          '"><span class="tag-text">' +
          item.value +
          '</span><span class="tag-close">x</span></span>'
        )
      })

      this.DOM.tags.innerHTML = items.join('')
    },

    bindEvents: function () {
      var that = this
      var input = that.DOM.input
      var dropdown = that.DOM.dropdown
      var tags = that.DOM.tags
      var clickEvent =
        'ontouchend' in document.documentElement === true ? 'touchend' : 'click'

      // use debounce optimize input
      that.onInput = _debouncer(function () {
        that.checkSuggestions(input.value)
      })

      input.addEventListener('input', that.onInput)

      _delegate(dropdown, clickEvent, '.dropdown-item', function (e) {
        var target = this

        that.updateTags('add', {
          index: +target.dataset.index,
          value: target.dataset.value
        })
      })

      _delegate(tags, clickEvent, '.tag-close', function (e) {
        var tagTarget = this.parentNode

        that.updateTags('remove', {
          index: +tagTarget.dataset.index,
          value: tagTarget.dataset.value
        })
      })
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

    checkSuggestions: function (value) {
      var that = this
      var suggestData = this.search(this.suggestions.src, value)

      // filter selected tag
      if (that.tags.indexs.length > 0) {
        suggestData = suggestData.filter(function (item) {
          return that.tags.indexs.indexOf(item.index) == -1
        })
      }

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
      var targetIndex = this.tags.indexs.indexOf(tag.index)

      switch (action) {
        case 'add':
          // check repeat
          if (targetIndex == -1) {
            this.tags.data.push(tag)
            this.tags.indexs.push(tag.index)

            this.DOM.input.value = ''
            this.DOM.input.focus()
            this.DOM.dropdown.classList.remove('show')
          }

          break
        case 'remove':
          if (targetIndex != -1) {
            this.tags.data.splice(targetIndex, 1)
            this.tags.indexs.splice(targetIndex, 1)

            this.DOM.input.focus()
          }

          break
        default:
          break
      }

      this.renderTags(this.tags.data)
    }
  }

  window.TagInput = window.TagInput || TagInput
})(window)
