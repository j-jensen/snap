define(['underscore'], function (_) {

    var MODEL = window.Symbol ? window.Symbol():'$$model';

    function View(config) {
        config || (config = {});
        _.extend(this, _.pick(config, ['initModel', 'render']));
        this[MODEL] = _.result(this, 'initModel');
        
        Object.defineProperty(this, 'model', {
            get: function () { return this[MODEL]; },
            set: function (newValue) {
                if (this[MODEL] != newValue) {
                    this[MODEL] = newValue;
                    // Mutate
                }
            }
        });
    }
    
    View.prototype = {
        render: function () { },

        setModel:function(attrs){
            _.extend(this[MODEL], attrs);
            // Mutate
        }

        destroy: function () {
        }
    };


    function Element(name, props /*, *children */){
        this.name = name;
        this.props = props || {};
        this.children = arguments.length > 2 ? _.rest(arguments, 2) : [];
        this.el = undefined;
    }

    Element.prototype = {
        render:function(){
            var el = this.el || (this.el = document.createElement(this.name));

            while(el.attributes.length)
                el.attributes.removeNamedItem(el.attributes.item(0).name);

            _.each(this.props, function(val, key){
                el.setAttribute(key, val);
            });

            while (el.firstChild)
                el.removeChild(el.firstChild);

            this.children.forEach(function(child){
                if(typeof child == 'string')
                    el.appendChild(document.createTextNode(child))
                else if(child instanceof Element)
                    el.appendChild(child.render());
                else
                    console.error('Only strings and Elements can bee children of Element');
            });
            return el;
        }
    };

    return {
        createView: function (config) {
            return new View(config);
        },

        createElement: function (name, props /*, *cildren*/) {
            return Element.apply(Object.create(Element.prototype), arguments);
        },

        render: function (snap, container) {
            if (!(snap instanceof View)) throw new Error('Only pass objects of type Snap.View to render.');
            var el = snap.render();
            container.appendChild(el);
        }
    };
});