/* global _extend, _throttler, _isPassiveSupported */

;(function (window) {
  'use strict'

  function LazyLoad(imgs, sets) {
    var defaultSets = {
      selector: '.lazyload'
    }

    this.sets = _extend({}, defaultSets, sets)

    this.imgs = Array.prototype.slice.call(
      imgs || document.querySelectorAll(this.sets.selector)
    )

    this.init()
  }

  LazyLoad.prototype = {
    init: function () {
      var that = this

      this.onCheckImgs = _throttler(function () {
        var clientHeight = document.documentElement.clientHeight
        var clientWidth = document.documentElement.clientWidth

        for (var index = 0; index < that.imgs.length; index++) {
          var img = that.imgs[index]
          var rect

          // fix ie bug
          try {
            rect = img.getBoundingClientRect()
          } catch (e) {
            rect = { top: 0, bottom: 0, left: 0, right: 0, width: 0, height: 0 }
          }

          if (
            rect.bottom > 0 &&
            rect.top < clientHeight &&
            rect.left < clientWidth // support scroll-x
          ) {
            if (img.dataset && img.dataset.src) {
              img.src = img.dataset.src
            }

            // remove loaded imgs
            that.imgs.splice(index, 1)

            index--

            // remove check event when all imgs loaded
            if (that.imgs.length < 1) {
              document.removeEventListener('scroll', that.onCheckImgs)
            }
          }
        }
      })

      // use passive optimize mobile scroll
      document.addEventListener('scroll', this.onCheckImgs, _isPassiveSupported)

      this.onCheckImgs()
    },

    update: function (imgs) {
      var newImgs = Array.prototype.slice.call(
        imgs || document.querySelectorAll(this.sets.selector)
      )

      this.imgs = this.imgs || []
      this.imgs = this.imgs.concat(newImgs)

      this.init()
    }
  }

  window.LazyLoad = window.LazyLoad || LazyLoad
})(window)
