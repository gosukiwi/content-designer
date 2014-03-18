/* global Backbone, _ */
(function (app) {
    'use strict';

    // the settings view of the app, it handles the attributes of each hmtl
    // element
    app.SettingsView = Backbone.View.extend({

        // the DOM element this view binds to, everything will be drawn there
        el: '#settings',

        // this view works with the element list as model
        model: app.elements,

        // cache the settings template
        template: _.template( $('#tpl-settings').html() ),

        // bind to DOM events of the view
        events: {
            'blur input': 'save'
        },

        // constructor, listen to the change:selected event as we'll have to
        // update the view according to the currently selected element, also
        // create the instance variable 'current' to hold the currently 
        // selected element
        initialize: function () {
            this.listenTo(this.model, 'change:selected', this.selectElement);

            this.current = null;
        },

        // called when an element's selected value changes, calls render 
        // accordingly
        selectElement: function (model, val) {
            this.current = val ? model : null;
            this.render();
        },

        // renders the settings menu according the the currently selected
        // element stored in this.current
        render: function () {
            if(this.current === null) {
                this.$el.empty();
                return this;
            }

            this.$el.html(this.template({
                attributes: this.current.get('attributes').toJSON()
            }));

            return this;
        },

        // called when an input loses focus, save changes to model
        save: function (e) {
            var input = $(e.target),
                key = input.attr('name'),
                value = input.val().trim();

            this.current.attr(key, value);
        }

    });
}(window.app));
