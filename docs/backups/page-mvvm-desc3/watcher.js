;(function (window) {
  'use strict'

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

  window.Watcher = window.Watcher || Watcher
})(window)
