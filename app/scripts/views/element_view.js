/* global Backbone, _ */
(function (app) {
    'use strict';

    // The representation of an ElementModel, which is a generic HTML element.
    app.ElementView = Backbone.View.extend({

        // element view constructor, it listens to model events and sets the
        // html element to represent the model.
        initialize: function () {
            // the child-added event is triggered by the toolbar when a
            // new element is added to this element (as long as this element
            // is a container)
            this.listenTo(this.model, 'child-added', this.addElement);

            // custom event in the ElementModel, triggers when an attribute has
            // been changed
            this.listenTo(this.model, 'attribute-changed', this.attributeChanged);

            // when the selected value changes
            this.listenTo(this.model, 'change:selected', this.onSelected);

            // when the model is destroyed, destroy view! this.remove is an
            // inherited method
            this.listenTo(this.model, 'remove', this.remove);

            // set the internal element to an according HTML element
            switch(this.model.get('name')) {
                case 'img':
                    this.setElement('<img />');
                    break;
                case 'para':
                    this.setElement('<p />');
                    break;
                case 'h1':
                    this.setElement('<h1 />');
                    break;
            }

            // set this as the currently selected element, as there can be only 
            // one, the collection will listen to this change and deselect
            // all other selected elements
            this.model.set('selected', true);
        },

        // bind to DOM events
        events: {
            'click': 'select'
        },

        // called when the element is clicked, it marks this element as 
        // selected, the app.elements collection makes sure to deselect all
        // other elements, so there is only one at a time.
        select: function (e) {
            e.stopImmediatePropagation();

            this.model.set('selected', true);
        },

        // called when selected is changed to either true or false, and
        // update $el accordingly
        onSelected: function (model, val) {
            if(val) {
                this.$el.addClass('selected');
            } else {
                this.$el.removeClass('selected');
            }
        },

        // render the element to the DOM, it gets called by a parent container
        // whenever the an element model is added to app.elements, the parent
        // container can either be the canvas or another element.
        render: function () {
            // the render process is easy, we already have the element in 'el',
            // and the parent will include it in to the DOM, so all it's left
            // is rendering the attributes of the object
            _.each(this.model.get('attributes').toJSON(), function (val, key) {
                this.renderAttribute(key, val);
            }, this);

            return this;
        },

        // called when one or several attributes of the current element 
        // changes.
        attributeChanged: function (attr) {
            _.each(attr.changed, function (val, key) {
                this.renderAttribute(key, val);
            }, this);
        },

        // renders a single attribute onto the current element, attributes can
        // be any custom thing, such as the class of the element, the text, or
        // a css property such as width or height.
        renderAttribute: function (key, val) {
            switch(key) {
                case 'text':
                    // render text, this can only happen for non-container 
                    // elements, simply add text to $el
                    if(!this.model.get('isContainer')) {
                        this.$el.text(val);
                    }
                    break;
                case 'class':
                    // render class attribute, simply add a class to $el
                    this.$el.removeClass().addClass(val);
                    break;
                case 'width':
                    this.$el.width(val);
                    break;
                case 'height':
                    this.$el.height(val);
                    break;
                case 'src':
                    this.$el.attr('src', val);
                    break;
                default:
                    // TODO: What to do when there's an invalid key? For now 
                    // just ignore
                    //console.log('Cannot render invalid attribute: ' + key);
                    break;
            }
        },

        // when a new element is added to the elements this, and has this
        // element as parent.
        addElement: function (model) {
            var view = new app.ElementView({ model: model });
            this.$el.append( view.render().el );
        }

    });
}(window.app));
