/* global Backbone */
(function (app) {
    'use strict';

    // A list of HTML elements, all the elements the app handles reside in
    // app.elements, an instance of this collection.
    app.ElementList = Backbone.Collection.extend({

        // the base model of this collection, by defining a model we can
        // now use the 'add' function with just an POJO object as attribute
        // and it will get create an according model on the fly
        model: app.ElementModel,

        // constructor, binds to collection events
        initialize: function () {
            // there can only be one selected
            this.on('change:selected', this.deselectOther);

            // whenever an element is added, trigger the some events
            this.on('add', this.added);
        },

        // when a new element gets added, trigger the custom event 
        // 'add-to-canvas' if the element has no parent, it not, trigger the
        // 'child-added' event on the parent model so the ElementView handles
        // it.
        added: function (model) {
            if(model.get('parent') === null) {
                this.trigger('add-to-canvas', model);
            } else {
                model.get('parent').trigger('child-added', model);
            }
        },

        // triggers when a model has been selected, as there can only be one, 
        // deselect all other models in the collection
        deselectOther: function (model, isSelected) {
            // if the selected value changed to false, just ignore this
            if(!isSelected) {
                return;
            }

            this.forEach(function (mdl) {
                if(mdl.get('selected') && mdl !== model) {
                    mdl.set('selected', false);
                }
            });
        },

        // deselect all models in the collection, used by canvas and toolbar
        deselect: function () {
            this.forEach(function (model) {
                if(model.get('selected')) {
                    model.set('selected', false);
                }
            });
        },

        // get the currently selected model or null if no model is selected
        selected: function () {
            return this.find(function (model) {
                return model.get('selected');
            });
        }

    });

    // this instance holds all of the elements in the app
    app.elements = new app.ElementList();
}(window.app));
