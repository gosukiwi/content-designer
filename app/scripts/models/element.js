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
            // set the initial attributes of this model, using the helper 
            // function getAttributesFor
            var elementAttributes = this.getAttributesFor(this.get('name'));
            var attrs = new Backbone.Model(elementAttributes);
            this.set('attributes', attrs);

            // some elements are not containers, let's see if we've got a 
            // container or not, by default, all elements are containers
            if($.inArray(this.get('name'), ['para', 'img', 'h1', 'h2', 'h3', 'h4', 'h5']) >= 0) {
                this.set('isContainer', false);
            }

            // if the element has text, set the initial value accordingly
            switch(this.get('name')) {
                case 'h1':
                    this.attr('text', 'Header 1');
                    break;
                case 'h2':
                    this.attr('text', 'Header 2');
                    break;
                case 'h3':
                    this.attr('text', 'Header 3');
                    break;
                case 'h4':
                    this.attr('text', 'Header 4');
                    break;
                case 'h5':
                    this.attr('text', 'Header 5');
                    break;
                case 'para':
                    this.attr('text', 'Lorem ipsum dolor sit amet.');
                    break;
            }

            // listen for changes in the attributes, and trigger a custom
            // event, so the view doesn't have to care how we manage the
            // attributes internally
            this.listenTo(attrs, 'change', this.attributeChanged);
        },

        // not all elements have the same attributes, for example, divs can
        // only have classes, images can have width and height, paragraphs
        // and headers can have text, etc.
        getAttributesFor: function (name) {
            switch(name) {
                case 'div':
                    return {
                        'class': ''
                    };
                case 'img':
                    return {
                        'src': 'http://placehold.it/250x250',
                        'align': 'auto',
                        'width': 'auto',
                        'height': 'auto'
                    };
                case 'h1':
                case 'para':
                    return {
                        'text': ''
                    };
                default:
                    return {};
            }
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
