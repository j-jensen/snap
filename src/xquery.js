/* DOM helper by Jesper Jensen */
var $ = (function (d) {
    var htmlre = /^<([^\s\/>]+) ?\/?>$/i,
        _extend = function(target, src){
            !src && (src=target) && (target=this);
            for (var i in src)
                src.hasOwnProperty(i) && (target[i]=src[i]);
            return this;
        };

    Array.prototype.forEach || (Array.prototype.forEach =function (callback, thisArg) { 
        for (var i = 0; i < this.length; i++) 
                callback.call((thisArg||this), this[i], i); 
    });

    function $(s, attr) {
        var self = this;
        if (this instanceof $)
            if(typeof s != 'string')
                this.push(s);
            else if(htmlre.test(s)){
                this.push(d.createElement(RegExp.$1));
                if(attr)
                    this.attr(attr);
            }
            else
                Array.prototype.forEach.call(d.querySelectorAll(s), function(el) {
                          this.push(el);
                }, this);
        else 
            return new $(s, attr);
    };
    $.prototype=[];

    _extend($.prototype, {
        extend: _extend,

        on: function (e, h) {
            this.forEach(function (el) {
                if (el.addEventListener)
                    el.addEventListener('click', h);
                else
                    el.attachEvent('on' + e, h);
            }); return this;
        },
        addClass: function (n) {
            this.removeClass(n);
            this.forEach(function (el) {
                el.className = (el.className ? el.className + ' ' : '') + n;
            });
            return this;
        },
        hasClass: function (n) {
            var re = new RegExp('(^|\\s)' + n + '(\\s|$)'), found = false;
            this.forEach(function (el) { return found || (found = re.test(el.className)); });
            return found;
        },
        toggleClass: function (n) {
            this.hasClass(n) ? this.removeClass(n) : this.addClass(n);
        },
        removeClass: function (n) {
            this.forEach(function (el) {
                var idx = -1, 
                a = el.className.split(' ');
                a.forEach(function (c, i) { if (c == n) idx = i; });
                if (idx < 0) return;

                a.splice(idx);
                el.className = a.join(' ');
            });
            return this;
        },
        append: function (el) {
            this.forEach(function (e) {
                e.appendChild((el instanceof $) ? el[0] : el);
            });
            return this;
        },
        attr: function (a) {
            if (typeof a == 'string')
                return this.length ? this[0][a] : undefined;
            this.forEach(function (el) { 
                for (var key in a)
                    a.hasOwnProperty(key) && el.setAttribute(key, a[key]);
            });
            return this;
        },
        html: function (html) {
            this.forEach(function (el) { 
                el.innerHTML = html; 
            });
            return this;
        }
    });
    return $;
})(document);