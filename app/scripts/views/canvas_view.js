/* global Backbone */
(function (app) {
    'use strict';

    // the canvas is a representation of the app.elements collection, it 
    // displays all elements which don't have a parent, if an element does have
    // a parent, the parent handles the rendeing.
    app.CanvasView = Backbone.View.extend({

        // the DOM element this view binds to, everything will be drawn onto it
        el: '#canvas',

        // the model this view represents
        model: app.elements,

        // constructor, listen to the model, whenever an element with no parent
        // is added, append the element's view to this view
        initialize: function () {
            this.listenTo(this.model, 'add-to-canvas', this.addElement);
        },

        // bind DOM events...
        events: {
            'click': 'deselectAll'
        },

        // deselects all elements in the canvas, it gets called when an empty 
        // part of the canvas is clicked
        deselectAll: function () {
            this.model.deselect();
        },

        // called when an element gets added to the collection and the element
        // has no parent
        addElement: function (model) {
            var view = new app.ElementView({ model: model });
            this.$el.append( view.render().el );
        }

    });
}(window.app));
