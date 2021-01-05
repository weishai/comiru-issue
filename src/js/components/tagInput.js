/* global _debouncer, _delegate, _extend, _eventDispatcher */

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
      mode: 'tag',
      suggestions: {
        src: [],
        max: 10,
        isLoose: false // search mode
      }
    }

    this.sets = _extend({}, defaultSets, sets)

    _extend(this, _eventDispatcher())

    // Store TagInput DOM elements
    this.DOM = {
      // root
      // input
      // dropdown
      // tags
    }

    // tags suggest data
    this.suggestions = {
      src: this.sets.suggestions.src
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
      var root = document.createElement('div')

      root.className = 'tag-input'

      root.innerHTML =
        '<span class="tags"></span>' +
        input.outerHTML +
        '<div class="tag-input-dropdown"></div>'

      input.parentNode.replaceChild(root, input)

      this.DOM.root = root
      this.DOM.input = root.querySelector('input')
      this.DOM.dropdown = root.querySelector('.tag-input-dropdown')
      this.DOM.tags = root.querySelector('.tags')
    },

    renderSuggestList: function (newData) {
      // no suggestions
      if (newData.length < 1) {
        this.closeSuggestList()

        return
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
      this.DOM.root.classList.add('dropdown-active')
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

    closeSuggestList: function () {
      if (this.DOM.dropdown.className.indexOf('show') == -1) {
        return
      }

      // this.DOM.dropdown.innerHTML = ''
      this.DOM.dropdown.classList.remove('show')
      this.DOM.root.classList.remove('dropdown-active')
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

      input.addEventListener('blur', function () {
        that.closeSuggestList()
      })

      input.addEventListener('keydown', function (e) {
        var tags = that.tags.data

        switch (e.key) {
          case 'Delete':
          case 'Backspace':
            if (tags.length > 0 && !input.value) {
              that.updateTags('remove', tags[tags.length - 1])
            }

            break
          default:
            break
        }
      })

      // fix input blur and dropdown item click conflict
      dropdown.addEventListener('mousedown', function (e) {
        e.preventDefault()
      })

      _delegate(dropdown, clickEvent, '.dropdown-item', function () {
        var target = this
        var value = target.dataset.value

        if (that.sets.mode == 'search') {
          that.DOM.input.value = value
        } else {
          that.updateTags('add', {
            index: +target.dataset.index,
            value: value
          })
        }

        that.trigger('tagAdd', {
          value: value
        })

        that.closeSuggestList()
      })

      _delegate(tags, clickEvent, '.tag-close', function () {
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
      var suggestData = this.search(
        this.suggestions.src,
        value,
        this.sets.suggestions.isLoose
      )

      // filter selected tag
      if (that.tags.indexs.length > 0) {
        suggestData = suggestData.filter(function (item) {
          return that.tags.indexs.indexOf(item.index) == -1
        })
      }

      if (this.sets.suggestions.max) {
        suggestData = suggestData.slice(0, this.sets.suggestions.max)
      }

      this.renderSuggestList(suggestData)
    },

    search: function (data, keyword, isLoose) {
      var results = []
      var word = keyword.toLowerCase().trim()

      if (!word) {
        return results
      }

      // console.log('word: ', word)

      for (var index = 0; index < data.length; index++) {
        var dataValue = data[index]

        // loose mode
        if (isLoose) {
          var looseDataValue = dataValue.toLowerCase()
          var looseWord = word.replace(/\s/g, '')
          var matchAt = -1
          var matchPos = 0
          var matchChar = ''

          for (var j = 0; j < looseDataValue.length; j++) {
            if (matchPos >= looseWord.length) {
              break
            }

            if (looseWord[matchPos] === looseDataValue[j]) {
              matchChar += looseDataValue[j]

              if (matchAt == -1) {
                matchAt = j
              }

              matchPos++
            }
          }

          if (matchChar && matchPos == looseWord.length) {
            results.push({
              index: index,
              match: {
                value: matchChar,
                index: matchAt,
                input: dataValue
              },
              value: dataValue
            })
          }
        } else {
          // strict mode
          var pattern = new RegExp(word, 'i')
          var match = pattern.exec(dataValue)

          if (match) {
            results.push({
              index: index, // use for optimize render
              match: {
                value: match[0],
                index: match.index,
                input: match.input
              },
              value: dataValue
            })
          }
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
