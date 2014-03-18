/* global Backbone */
(function (app) {
    'use strict';

    // Represents HTML element
    app.ElementModel = Backbone.Model.extend({

        // default values for this model
        defaults: {
            // the name or type of the element, basically the HTML tag it represents
            'name': '',

            // does this element have a partent or is it in the root?
            'parent': null,

            // can this element have children elements? <p /> tags cannot for example
            'isContainer': true,

            // is this element currently selected?
            'selected': false
        },

        // constructor, it creates a new attributes model stored in 'attributes'
        // and bind a change event to listen to changes to the attributes
        initialize: function () {
            var attrs = new app.AttributesModel();
            this.set('attributes', attrs);
            this.listenTo(attrs, 'change', this.attributeChanged);
        },

        // sets or gets an attribute value
        attr: function (name, val) {
            if(val) {
                this.get('attributes').set(name, val);
            }

            return this.get('attributes').get(name);
        },

        // triggered when an attribute is changed, it triggers an 
        // 'attribute-changed' event, to make it easier to bind for the view,
        // hiding extra complexity
        attributeChanged: function (changed) {
            this.trigger('attribute-changed', changed);
        }

    });
}(window.app));