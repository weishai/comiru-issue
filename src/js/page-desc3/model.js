;(function (window) {
  'use strict'

  function Model() {
    this.data = {
      keyword: '',
      list: [],
      page: 1
    }

    this.listeners = []
  }

  Model.prototype = {
    subscribe: function (listener) {
      this.listeners.push(listener)
    },

    notify: function (name, newValue) {
      for (var i = 0; i < this.listeners.length; i++) {
        this.listeners[i](name, newValue)
      }
    },

    getValue: function (name) {
      return this.data[name]
    },

    setValue: function (name, value) {
      this.data[name] = value

      this.notify(name, value)
    },

    init: function () {
      this.fetchList(this.data.page)
    },

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
