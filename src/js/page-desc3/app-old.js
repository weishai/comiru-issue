/* global TagInput, LazyLoad, Mock */

;(function () {
  'use strict'

  // Mock Data for NewsList example
  var dataMock = Mock.mock({
    'suggestions|100-1000': ['@name']
  })

  function NewsList() {
    this.page = 1

    this.DOM = {
      list: document.querySelector('.news-list')
    }

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

      this.fetchNews(this.page)
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
      var items = data.map(function (item) {
        /* eslint-disable */
        var html =
          '<a class="newsbox"href="javascript:;">' +
            '<div class="box-body">' +
              '<div class="box-main">' +
                '<div class="box-user">' +
                  '<img class="box-icon lazyload" data-src="'+item.icon+'" alt="">' +
                  '<span class="box-name">'+item.name+'</span>'+
                '</div>'+
                '<h3 class="box-title">'+item.title+'</h3>'+
              '</div>'+
              '<div class="box-cover">'+
                '<img class="lazyload" data-src="'+item.cover+'" alt="">'+
              '</div>'+
            '</div>'+
            '<div class="box-foot">'+
              '<span class="box-time">'+item.time+'</span>' +
            '</div>'+
          '</a>'
        /* eslint-enable */

        return html
      })

      this.DOM.list.innerHTML = items
    }
  }

  /* Page Init */
  new NewsList()
})()
