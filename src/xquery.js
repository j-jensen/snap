
define([], function () {
    var d = window.document,
        reHTML = /^<([^\s\/>]+) ?\/?>$/i;

    function $(s, props) {
        if (this instanceof $){
            if ((this.selector = s) == undefined)
                return;

            if(typeof s != 'string')
                this.push(s);
            else if(reHTML.test(s)){
                this.push(d.createElement(RegExp.$1));
                if(props)
                    this.prop(props);
            }
            else
                Array.prototype.forEach.call(d.querySelectorAll(s), function(el) {
                          this.push(el);
                }, this);
        }else 
            return new $(s, props);
    };
    $.prototype = [];
    $.prototype.constructor = $;

    var props = {
        addClass: {
            value :function (name) {
                this.removeClass(name);
                this.forEach(function (el) {
                    el.className = (el.className ? el.className + ' ' : '') + name;
                });
                return this;
            }
        },
        after: {
            value : function (el) {
                this.forEach(function (element) {
                    el.length && element.parentNode.insertBefore(el[0], element.nextSibling);
                });
                return this;
            }
        },
        append: {
            value : function (el) {
                this.forEach(function (element) {
                    el.length && element.appendChild(el[0]);
                });
                return this;
            }
        },
        attr: {
                value : function (src) {
                if (typeof src == 'string')
                    return this.length ? this[0][src] : undefined;
                this.forEach(function (el) {
                    for (var k in src) src.hasOwnProperty(k) && el.setAttribute(k, src[k]);
                });
                return this;
            }
        },
        hasClass: {
            value : function (name) {
                var re = new RegExp('(^|\\s)' + name + '(\\s|$)'), found = false;
                this.forEach(function (el) { return found || (found = re.test(el.className)); });
                return found;
            }
        },
        html:  {
                value :function (html) {
                if (!arguments.length)
                    return this.length ? this[0].innerHTML : undefined;
                this.forEach(function (el) { el.innerHTML = html; });
                return this;
            }
        },
        on: {
            value : function (event, handler) {
                this.forEach(function (el) {
                    if (el.addEventListener)
                        el.addEventListener(event, handler);
                    else
                        el.attachEvent('on' + event, handler);
                });
                return this;
            }
        },
        parent: {
                value : function () {
                var parent = new $();
                this.forEach(function (el) { parent.push(el.parentElement); });
                return parent;
            }
        },
        prop: {
            value : function(props){
                if (typeof src == 'string')
                    return this.length ? this[0][props] : undefined;
                this.forEach(function (el) {
                    for (var key in props) props.hasOwnProperty(key) && (el[key] = props[key]);
                });
                return this;
            }
        },
        removeClass: {
            value : function (name) {
                this.forEach(function (el) {
                    var idx = -1, a = el.className.split(' ');
                    a.forEach(function (className, i) {
                        if (className == name) 
                            idx = i;
                    });
                    if (idx < 0) 
                        return;
                    a.splice(idx, 1);
                    el.className = a.join(' ');
                });
                return this;
            }
        },
        text: {
            value : function(text){
                if (!arguments.length)
                    return this.length ? this[0].innerText : undefined;
                this.forEach(function (el) { 
                    !el.innerText ? (el.textContent = text): (el.innerText = text); });
                return this;
            }
        },
        toggleClass: {
            value : function (name) {
                this.hasClass(name) ? this.removeClass(name) : this.addClass(name);
            }
        }
    };
    Object.defineProperties($.prototype, props);

    return $;
});