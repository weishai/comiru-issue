/* global app */

;(function () {
  'use strict'

  function NewsList() {
    this.model = new app.Model()
    this.view = new app.View()
    this.controller = new app.Controller(this.model, this.view)
  }

  new NewsList()
})()
