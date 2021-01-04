/* global _extend */

;(function (window) {
  'use strict'

  function LazyLoad(imgs, sets) {
    var defaultSets = {
      selector: '.lazyload'
    }

    this.sets = _extend({}, defaultSets, sets)

    this.imgs = imgs || document.querySelectorAll(this.sets.selector)

    // IntersectionObserver instance
    this.io = null

    this.init()
  }

  LazyLoad.prototype = {
    init: function () {
      if (!window.IntersectionObserver) {
        console.warn('LazyLoad fail: loadImgs now')

        this.loadImgs()

        return
      }

      var that = this

      this.io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          // set img src only when in the viewport
          if (entry.isIntersecting) {
            var img = entry.target

            if (img.dataset && img.dataset.src) {
              img.src = img.dataset.src
            }

            // when img is loaded, not need to observe
            that.io.unobserve(img)
          }
        })
      })

      Array.prototype.forEach.call(this.imgs, function (img) {
        that.io.observe(img)
      })
    },

    loadImgs: function () {
      Array.prototype.forEach(this.imgs, function (img) {
        if (img.dataset.src) {
          img.src = img.dataset.src
        }
      })
    },

    update: function () {
      this.imgs = document.querySelectorAll(this.sets.selector)

      this.init()
    }
  }

  window.LazyLoad = window.LazyLoad || LazyLoad
})(window)
