define(['underscore'], function (_) {
    var MODEL = window.Symbol ? window.Symbol() : '$$model',
        EL = window.Symbol ? window.Symbol() : '$$el';

    function View(config) {
        config || (config = {});
        _.extend(this, _.pick(config, ['initState', 'render']));
        var state = _.result(this, 'initState');
        Object.defineProperty(this, 'state', {
            get: function () { return state; },
            set: function (newValue) {
                if (state != newValue) {
                    state = newValue;
                    // Mutate
                }
            }
        });
    }

    View.prototype = {
        render: function () { },

        destroy: function () {
        }
    };

    return {
        createView: function (config) {
            return new View(config);
        },

        fromTemplate: function (templateString) {
            var el = document.createElement('div'),
                template = _.template(templateString);

            return function () {
                el.innerHtml = template(this.state);
                return el;
            };
        },

        render: function (snap, container) {
            if (!(snap instanceof View)) throw new Error('Only pass objects of type Snap.View to render.');
            var el = snap.render();
            container.appendChild(el);
        }
    };
});