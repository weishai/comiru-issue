/* global TagInput, LazyLoad, Mock */

;(function () {
  'use strict'

  // Mock Data for NewsList example
  var dataMock = Mock.mock({
    'suggestions|100-1000': ['@name']
  })

  function NewsList() {
    this.page = 1

    this.init()
  }

  NewsList.prototype = {
    init: function () {
      // Search Bar input
      var input = document.querySelector('.search-input')

      new TagInput(input, {
        mode: 'search',
        suggestions: {
          src: dataMock.suggestions
        }
      })

      // Images lazy load
      new LazyLoad()
    },

    fetchNews: function (page) {
      var that = this
      var request = new XMLHttpRequest()

      request.open('GET', 'https://apidomain.com?page=' + page, true)

      request.onload = function () {
        // server error
        if (this.status < 200 || this.status >= 400) {
          // handle server error

          return
        }

        var res = this.response

        if (!res.errcode) {
          that.renderNews(res.list, res.total)
        }
      }

      request.onerror = function () {
        // There was a connection error of some sort
      }

      request.send()
    },

    renderNews: function (data, total) {
      
    }
  }

  /* Page Init */

  new NewsList()
})()
