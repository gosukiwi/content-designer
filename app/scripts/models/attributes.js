/* global Backbone */
/**
 */
(function (app) {
    'use strict';

    app.AttributesModel = Backbone.Model.extend({
        defaults: {
            'text': null,
            'width': 'auto',
            'height': 'auto'
        }
    });
}(window.app));
