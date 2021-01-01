/* global app */

;(function () {
  'use strict'

  function NewsList() {
    this.model = new app.Model()
    this.view = new app.View()
    this.viewmodel = new app.ViewModel(this.model, this.view)

    this.model.init()
  }

  new NewsList()
})()
