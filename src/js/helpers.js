/**
 * helpers functions use in global, function name start with '_'
 */

;(function (window) {
  'use strict'

  function isObject(obj) {
    var type = Object.prototype.toString.call(obj).split(' ')[1].slice(0, -1)

    return (
      obj === Object(obj) &&
      type != 'Array' &&
      type != 'Function' &&
      type != 'RegExp' &&
      !/Element/.test(type)
    )
  }

  function isArray(a) {
    return a instanceof Array
  }

  function clone(obj) {
    var copy

    if (obj == null || typeof obj != 'object') {
      return obj
    }

    // Handle Array
    if (isArray(obj)) {
      copy = []

      for (var i = 0, len = obj.length; i < len; i++) {
        copy[i] = clone(obj[i])
      }
      return copy
    }

    // Handle Object
    if (isObject(obj)) {
      copy = {}

      for (var attr in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, attr)) {
          copy[attr] = clone(obj[attr])
        }
      }

      return copy
    }

    throw new Error('clone error: type is not supported')
  }

  function copy(a, b) {
    for (var key in b) {
      if (Object.prototype.hasOwnProperty.call(b, key)) {
        if (isObject(b[key])) {
          if (!isObject(a[key])) {
            a[key] = clone(b[key])
          } else {
            copy(a[key], b[key])
          }

          continue
        }

        if (isArray(b[key])) {
          a[key] = (isArray(a[key]) ? a[key] : []).concat(b[key])

          continue
        }

        a[key] = b[key]
      }
    }
  }

  window._extend = function (o, o1, o2) {
    if (!isObject(o)) {
      o = {}
    }

    copy(o, o1)

    if (o2) {
      copy(o, o2)
    }

    return o
  }

  window._eventDispatcher = function () {
    // Create a DOM EventTarget
    var target = document.createTextNode('')

    function eventHandle(op, events, cb) {
      if (cb) {
        events.split(/\s+/g).forEach(function (name) {
          return target[op + 'EventListener'].call(target, name, cb)
        })
      }
    }

    // Pass EventTarget interface calls to DOM EventTarget object
    return {
      off: function (events, cb) {
        eventHandle('remove', events, cb)

        return this
      },

      on: function (events, cb) {
        if (cb && typeof cb == 'function') {
          eventHandle('add', events, cb)
        }

        return this
      },

      trigger: function (eventName, data) {
        var e

        if (!eventName) {
          return
        }

        try {
          var eventData = window._extend(
            {},
            typeof data === 'object' ? data : { value: data }
          )

          e = new CustomEvent(eventName, { detail: eventData })
        } catch (err) {
          console.warn(err)
        }

        target.dispatchEvent(e)
      }
    }
  }

  window._debouncer = function (cb, delay) {
    var inDebounce

    delay = delay || 300

    return function () {
      var that = this
      var args = arguments

      clearTimeout(inDebounce)

      inDebounce = setTimeout(function () {
        cb.apply(that, args)
      }, delay)
    }
  }

  window._parseHTML = function (str) {
    var tmp = document.implementation.createHTMLDocument()

    tmp.body.innerHTML = str

    return tmp.body.children
  }
})(window)
