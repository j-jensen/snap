define(['underscore'], function (_) {
    var MODEL = window.Symbol ? window.Symbol() : '$$model',
        EL = window.Symbol ? window.Symbol() : '$$el';

    function Snap(config) {
        config || (config = {});
        _.extend(this, _.pick(config, ['initialize', 'render']));

        this[MODEL] = _.result(config, 'model');
        this.initialize.apply(this, arguments);
    }

    Snap.prototype = {

        initialize: _.identity,

        render: _.identity,

        destroy: function () {
        },

        setModel: function (model) {
            this[MODEL] = model;
            this[EL] = this.render();
        },

        getModel: function () {
            return this[MODEL];
        }
    };

    return {
        create: function (config) {
            return new Snap(config);
        },

        render: function (snap, container) {
            var el = snap.render();
            container.appendChild(el);
        }
    };
});