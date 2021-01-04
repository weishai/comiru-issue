/* global Mock, TagInput, LazyLoad, MVVM */

;(function () {
  'use strict'

  /* Mock Data for NewsList example START */
  var dataMock = Mock.mock({
    'suggestions|100-1000': ['@name']
  })

  Mock.mock('/news', function () {
    var res = Mock.mock({
      'list|10': [
        {
          icon: '@image',
          name: '@name',
          cover: '@image',
          title: '@sentence',
          time: '@date'
        }
      ],
      'total|100-1000': 1
    })

    res.list = res.list.map(function (item) {
      if (item.title.length > 126) {
        item.title = item.title.slice(0, 126) + '...'
      }

      return item
    })

    return res
  })

  Mock.setup({
    timeout: 400
  })
  /* Mock Data for NewsList example END */

  new MVVM({
    element: '.news-list',
    data: {
      page: 1,
      list: [],
      keyword: null
    },

    methods: {
      nextPage: function () {}
    },

    init: function () {
      // Search Bar input
      var input = document.querySelector('.search-input')
      var btnSearch = document.querySelector('.btn-search')

      this.TagInput = new TagInput(input, {
        mode: 'search',
        suggestions: {
          src: dataMock.suggestions
        }
      })

      btnSearch.classList.add('show')

      // Images lazy load
      this.LazyLoad = new LazyLoad()
    }
  })
})()
