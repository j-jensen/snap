define([], function(){
	'use strict';

	var allOff = function(hub, type){
		if(type) delete hub[type];
		else{
			for(var k in hub)
				if(hub.hasOwnProperty(k))
					delete hub[k];
		}
	},

	on = function(hub, type, handler){
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
		if(hub.hasOwnProperty(type))
			hub[type].forEach(function(handler){
				setTimeout(Function.prototype.apply.bind(handler, this, args), 0);
			}.bind(this));
	},

	props = function(self){
		var hub = {};
		return {
			allOff: { value: allOff.bind(self, hub) }, 
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