/* global Backbone, _ */
(function (app) {
    'use strict';

    // a status bar, displays information about the current state of the app
    app.StatusBarView = Backbone.View.extend({

        // the DOM element this view binds to, everything will be drawn onto it
        el: '#status-bar',

        // the model this view represents
        model: app.elements,

        // cache the template
        template: _.template( $('#tpl-status-bar').html() ),

        // constructor, listen to the model, whenever the collection changes,
        // reflect it in the status bar
        initialize: function () {
            this.listenTo(this.model, 'all', this.render);
        },

        // render this view onto the element
        render: function () {
            this.$el.html( this.template({
                text: 'Idle',
                elements: this.model.length,
                current: this.model.selected()
            }) );
        }

    });
}(window.app));
