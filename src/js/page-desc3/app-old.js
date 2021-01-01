/* global TagInput, LazyLoad, Mock, _delegate, _ajax */

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
      'total|50-1000': 1
    })

    res.list = res.list.map(function (item) {
      if (item.title.length > 126) {
        item.title = item.title.slice(0, 126) + '...'
      }

      return item
    })

    return res
  })
  /* Mock Data for NewsList example END */

  function NewsList() {
    this.page = 1
    this.pageSize = 10
    this.keyword = ''

    this.DOM = {
      list: document.querySelector('.news-list'),
      pager: document.querySelector('.pager')
    }

    this.init()
  }

  NewsList.prototype = {
    init: function () {
      // Search Bar input
      var input = document.querySelector('.search-input')

      this.TagInput = new TagInput(input, {
        mode: 'search',
        suggestions: {
          src: dataMock.suggestions
        }
      })

      // Images lazy load
      this.LazyLoad = new LazyLoad()

      // Bind events
      this.bindEvents()

      this.fetchNews(this.page)
    },

    bindEvents: function () {
      var that = this
      var pager = this.DOM.pager
      var clickEvent =
        'ontouchend' in document.documentElement === true ? 'touchend' : 'click'

      this.TagInput.on('tagAdd', function (e) {
        var value = e.detail

        that.search(value)
      })

      _delegate(pager, clickEvent, '.btn-page', function () {
        var action = this.dataset.action

        that.goPage(action)
      })
    },

    fetchNews: function (page) {
      var that = this
      var params = {
        page: page
      }

      if (this.keyword) {
        params.keyword = this.keyword
      }

      _ajax({
        url: '/news',
        data: params,
        onSuccess: function (res) {
          that.page = page

          that.renderNews(res.list)
          that.renderPager(page, res.total)
        }
      })
    },

    goPage: function (action) {
      if (action == 'next') {
        this.page++
      } else if (action == 'prev') {
        this.page--
      }

      this.fetchNews(this.page)

      // optimize user scan
      window.scrollTo(0, 0)
    },

    search: function (value) {
      this.keyword = value

      this.fetchNews(1)
    },

    renderNews: function (data) {
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

      this.DOM.list.innerHTML = items.join('')

      this.LazyLoad.update()
    },

    renderPager: function (page, total) {
      var pagerBtns = ''

      if (page > 1) {
        pagerBtns = '<div class="btn-page" data-action="prev">上一页</div>'
      }

      if (this.pageSize * page < total) {
        pagerBtns += '<div class="btn-page" data-action="next">下一页</div>'
      }

      this.DOM.pager.innerHTML = pagerBtns
    }
  }

  /* Page Init */
  new NewsList()
})()
