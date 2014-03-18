/* global Backbone */
(function (app) {
    'use strict';

    // The app view, this is the main view and hold all other sub-views, 
    // especifically the canvas, the toolbar and the statusbar
    app.AppView = Backbone.View.extend({

        // the DOM element this view binds to, everything will be drawn there
        el: '#design-app',

        // constructor, instantiate all baby-views
        initialize: function () {
            this.canvasView = new app.CanvasView();
            this.toolbarView = new app.ToolbarView();
            this.statusBarView = new app.StatusBarView();
            this.settingsView = new app.SettingsView();

            this.render();
        },

        // render the views, this is called once in the constructor
        render: function () {
            this.canvasView.render();
            this.toolbarView.render();
            this.statusBarView.render();
            this.settingsView.render();
        }

    });
}(window.app));
