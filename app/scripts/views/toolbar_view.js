/* global Backbone, _ */
(function (app) {
    'use strict';

    // the toolbar is in charge of adding new models to the app.elements 
    // collection, the models draw themselves accordingly with views listening
    // to app.elements events.
    app.ToolbarView = Backbone.View.extend({

        // the toolbar lives in the DOM, an element with id toolbar
        el: '#toolbar',

        // bind to DOM events
        events: {
            'click a': 'action'
        },

        // performs a toolbar action, there are two types so far, 'add' and 
        // 'edit'. 'add' actions insert elements to the canvas, while 'edit' 
        // actions update current elements.
        action: function (e) {
            var name = $(e.target).attr('name');
            var action = $(e.target).attr('action');

            if(action === 'add') {
                this.add(name);
            } else if(action === 'edit') {
                this.edit(name);
            } else {
                throw 'Invalid action: ' + action;
            }
        },

        // perform an edit action, depending on the name parameter
        edit: function (name) {
            // if we have to select the parent
            if(name === 'select-parent') {
                // get current element
                var current = app.elements.selected();

                // if it's not null, get the parent, and if the parent
                // is not null, select it. If it's null it's the canvas, so
                // deselect all elements.
                if(current) {
                    var container = current.get('parent');
                    if(container) {
                        container.set('selected', true);
                    } else {
                        app.elements.deselect();
                    }
                }
            }
        },

        // helper method, it displays a dialog to select the rows, and returns
        // a promise, when it resolves, it passes the rows as an array. It can
        // be used as such:
        //
        //  showRowDialog().then(function(rows){ /* rows is an array */ });
        //
        // it only resolves to true if the OK button is clicked and the
        // input is valid.
        showRowDialog: function () {
            var def = $.Deferred();
            $( $('#tpl-row-dialog').html() ).dialog({
                buttons: {
                    'OK': function () {
                        var val = $(this).find('input').val().trim();

                        if(val) {
                            def.resolve(val.split(' '));
                        } else {
                            def.reject();
                        }
                        $(this).dialog('close');
                    },
                    'Cancel': function () {
                        def.reject();
                        $(this).dialog('close');
                    }
                }
            });
            return def.promise();
        },

        // adds a new element model of type 'name' to the collection, and 
        // returns it, it can add nested elements.
        // as this method returns the model it can be used recursively to
        // create nested elements, as is the case when creating a 'row' 
        // element
        add: function (name) {
            // nested elements require some work, add them separately
            if(name === 'row') {
                return this.addRow();
            }

            // let's find out the container of this new element, if the 
            // currently selected element is a container, then that's it! but
            // if it's not, just set it to null, so it gets added to the root
            // element, the canvas.
            var selected = app.elements.selected();
            var container = (selected && selected.get('isContainer')) ? selected : null;

            // the base attributes for a new element
            var attrs = {
                'name': name,
                'parent': container
            };

            // create the element model
            var elem = new app.ElementModel(attrs);

            // customize the model for each type
            if(name === 'para') {
                elem.attr('text', 'Paragraph.');
                elem.set('isContainer', false);
            } else if(name === 'h1') {
                elem.attr('text', 'Header 1');
                elem.set('isContainer', false);
            }

            // add the element to the list and let the views handle it!
            app.elements.add(elem);

            // return the element so this method can be used to create 
            // nested elements as 'addRow' does.
            return elem;
        },

        // private helper method for adding a row element to the canvas, used 
        // by the 'add' method.
        addRow: function () {
            var grid = this.add('div'),
                self = this;

            grid.attr('class', 'pure-g');

            this.showRowDialog()
                .then(function (rows) {
                    _.each(rows, function(row) {
                        var div = self.add('div');
                        div.attr('class', 'pure-u-' + row);

                        self.add('para');

                        grid.set('selected', true);
                    });
                });
            
            return grid;
        },

    });
}(window.app));
