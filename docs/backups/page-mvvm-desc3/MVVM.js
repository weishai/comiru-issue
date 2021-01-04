;(function (window) {
  'use strict'

  function MVVM(options) {
    this.methods = options.methods

    this.observe(options.data)
    this.compile(document.querySelector(options.element))

    options.init && options.init()
  }

  MVVM.prototype = {
    observe: function (data) {
      for (var key in data) {
        this.defineReactive(this, key, data[key])
      }
    },

    defineReactive: function (data, key, value) {
      var dep = []

      Object.defineProperty(data, key, {
        enumerable: true,
        configurable: true,
        get: function () {
          dep.push(this.target)

          return value
        },
        set: function (newVal) {
          if (value === newVal) {
            return
          }

          value = newVal

          dep.forEach(function (watcher) {
            watcher.update(value)
          })
        }
      })
    },

    compile: function (dom) {
      var nodes = dom.childNodes

      for (var node in nodes) {
        var attrs = node.attributes || []

        // 解析指令
        for (var attr in attrs) {
          switch (attr.name) {
            case 'v-model':
              node.addEventListener('input', function (e) {
                this[attr.value] = e.target.value
              })

              this.target = new Watcher(node, 'input')

              this[attr.value]

              break
            case '@click':
              node.addEventListener('click', function () {
                return this.methods[attr.value].call(this)
              })

              break
            default:
              break
          }
        }

        var match = (node.innerText || '').match(/\{\{(.*)\}\}/)

        if (match) {
          var name = match[1].trim()

          this.target = new Watcher(node, 'text')
          this[name]
        }
      }
    }
  }

  function Watcher(node, type) {
    this.node = node
    this.type = type
    this.template = node.innerText
  }

  Watcher.prototype = {
    update: function (value) {
      switch (this.type) {
        case 'input':
          this.node.value = value

          break
        case 'text':
          this.node.innerText = this.template.replace(/\{\{(.*)\}\}/g, value)

          break
        default:
          break
      }
    }
  }

  window.MVVM = window.MVVM || MVVM
})(window)
