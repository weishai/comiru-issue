;(function (window) {
  'use strict'

  function Model() {
    this.data = {
      keyword: '',
      list: [],
      page: 1
    }
  }

  Model.prototype = {
    fetchList: function (page) {
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
          that.model.setValue('list', res.list)
        }
      }

      request.onerror = function () {
        // There was a connection error of some sort
      }

      request.send()
    }
  }

  window.app = window.app || {}
  window.app.Model = Model
})(window)
