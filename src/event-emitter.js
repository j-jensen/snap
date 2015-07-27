define([], function(){
	'use strict';

	var on = function(hub, type, handler){
		if(!type || !handler) return;
		(hub[type] || (hub[type] = [])).push(handler);
	},

	once = function(hub, type, handler){
		(hub[type] || (hub[type] = [])).push(function(){
			this.off(type, handler);
			handler.apply(this, arguments);
		}.bind(this));
	},

	off = function(hub, type, handler){
		if(hub.hasOwnProperty(type)){
			if(!handler)
				delete hub[type];
			else if((idx = hub[type].indexOf(handler)) >= 0)
				hub[type].splice(idx, 1);
		}
	},

	emit = function(hub, type){
		var args = arguments.length > 2 ? Array.prototype.slice.call(arguments, 2) : [];
		_emit.call(this, hub, type, args);

		if(!hub['all'])return;
		args.unshift(type);
		_emit.call(this, hub, 'all', args);
	},

	_emit = function(hub, type, args){
		if(type.type){
			args = type;
			type = type.type;
		}
		if(hub.hasOwnProperty(type)){
			hub[type].forEach(function(handler){
				if(Array.isArray(args))
					setTimeout(Function.prototype.apply.bind(handler, this, args), 0);
				else
					setTimeout(Function.prototype.call.bind(handler, this, args), 0);
			}.bind(this));
		}
	},

	props = function(self){
		var hub = {};
		return {
			on: 	{ value: on.bind(self, hub)	},
			once: 	{ value: once.bind(self, hub) },
			off: 	{ value: off.bind(self, hub) },
			emit: 	{ value: emit.bind(self, hub) }
		}
	};

	return function EventEmitter(o){
		o = o || ((this instanceof EventEmitter) ? this : {});
		Object.defineProperties(o, props(o));
		return o;
	};
});