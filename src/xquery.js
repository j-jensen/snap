/* DOM helper by Jesper Jensen */
var $ = (function (d) {
    var reHTML = /^<([^\s\/>]+) ?\/?>$/i,
        extend = function(target, src){
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
        if (this instanceof $){
            if ((this.selector = s) == undefined)

            if(typeof s != 'string')
                this.push(s);
            else if(reHTML.test(s)){
                this.push(d.createElement(RegExp.$1));
                if(attr)
                    this.attr(attr);
            }
            else
                Array.prototype.forEach.call(d.querySelectorAll(s), function(el) {
                          this.push(el);
                }, this);
        }else 
            return new $(s, attr);
    };
    $.prototype=[];

    extend($.prototype, {
        addClass: function (n) {
            this.removeClass(n);
            this.forEach(function (el) {
                el.className = (el.className ? el.className + ' ' : '') + n;
            });
            return this;
        },
        after: function (el) {
            this.forEach(function (element) {
                el.length && element.parentNode.insertBefore(el[0], element.nextSibling);
            });
            return this;
        },
        append: function (el) {
            this.forEach(function (element) {
                el.length && element.appendChild(el[0]);
            });
            return this;
        },
        attr: function (src) {
            if (typeof src == 'string')
                return this.length ? this[0][src] : undefined;
            this.forEach(function (el) {
                for (var k in src) src.hasOwnProperty(k) && el.setAttribute(k, src[k]);
            });
            return this;
        },
        extend: extend,
        hasClass: function (n) {
            var re = new RegExp('(^|\\s)' + n + '(\\s|$)'), found = false;
            this.forEach(function (el) { return found || (found = re.test(el.className)); });
            return found;
        },
        html: function (h) {
            this.forEach(function (el) { el.innerHTML = h; });
            return this;
        },
        on: function (e, h) {
            this.forEach(function (el) {
                if (el.addEventListener)
                    el.addEventListener('click', h);
                else
                    el.attachEvent('on' + e, h);
            });
            return this;
        },
        parent: function () {
            var parent = new $();
            this.forEach(function (el) { parent.push(el.parentElement); });
            return parent;
        },
        removeClass: function (n) {
            this.forEach(function (el) {
                var idx = -1, a = el.className.split(' ');
                a.forEach(function (c, i) {
                    if (c == n) idx = i;
                });
                if (idx < 0) return;
                a.splice(idx, 1);
                el.className = a.join(' ');
            });
            return this;
        },
        toggleClass: function (n) {
            this.hasClass(n) ? this.removeClass(n) : this.addClass(n);
        }
    });
    return $;
})(document);