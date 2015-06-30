var $ = (function (d) {
    var _each = function (a, f) { for (var i = 0; i < a.length; i++) f(a[i], i); };

    var $ = function (s) {
            if (this instanceof $)
                (this.el = d.querySelectorAll(s)).length || (this.el = [d.createElement(s)]) || [];
            else return new $(s);
        };

    $.prototype = {
        on: function (e, h) {
            _each(this.el, function (el) {
                if (el.addEventListener)
                    el.addEventListener('click', h);
                else
                    el.attachEvent('on' + e, h);
            }); return this;
        },
        addClass: function (n) {
            this.removeClass(n);
            _each(this.el, function (el) {
                el.className = (el.className ? el.className + ' ' : '') + n;
            });
            return this;
        },
        hasClass: function (n) {
            var re = new RegExp('(^|\\s)' + n + '(\\s|$)'), found = false;
            _each(this.el, function (el) { return found || (found = re.test(el.className)); });
            return found;
        },
        toggleClass: function (n) {
            this.hasClass(n) ? this.removeClass(n) : this.addClass(n);
        },
        removeClass: function (n) {
            _each(this.el, function (el) {
                var idx = -1, a = el.className.split(' ');
                _each(a, function (c, i) {
                    if (c == n) idx = i;
                });
                if (idx < 0) return;
                a.splice(idx);
                el.className = a.join(' ');
            });
            return this;
        },
        append: function (el) {
            _each(this.el, function (e) {
                e.appendChild(el.el ? el.el[0] : el);
            });
            return this;
        },
        attr: function (a) {
            if (typeof a == 'string')
                return this.el[0][a];
            _each(this.el, function (el) { for (var i in a) el[i] = a[i]; });
            return this;
        },
        html: function (h) {
            _each(this.el, function (el) { el.innerHTML = h; });
            return this;
        }
    };
    return $;
})(document);