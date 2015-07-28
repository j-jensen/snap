define(['event-emitter', 'promise', 'ajax'], function(EventEmitter, Promise, ajax){
	'use strict';

	return function(config){
		var url = config.url,
		idAttribute = config.idAttribute || 'id',

		properties = function(defaults, state){
			var props = {
				id: {
					enumerable: true,
					set: function(value){ state[idAttribute] = value; },
					get: function(){ return state[idAttribute] },
				},
				changes: {
					enumerable: false,
					get: function(){ return state.__changes; }
				}
			};
			for(var key in defaults){
				(function(key){
					state[key] = defaults[key],
					props[key] = {
						enumerable: true,
						set: function(val){
							if(val != state[key]){
								state.__changes[key] = val;
								this.emit('change', {
									type:'change', name:key, value:val, oldValue: state[key]});
								state[key] = val;
							}
						},
						get: function(){
							return state[key];
						}
					};
				})(key);
			}
			return props;			
		}.bind(null, config.defaults || {}),

		reset = function(values, target){
			for(var key in values){
				target[key] = values[key];
			}
			target.__changes = {};
		},

		instanceMethods = function(state){
			return {
				fetch: {
					writable: false,
					enumerable: false,
					value: function(){
						return ajax.get([url, this.id].join('/'))
							.then(function(model){
								reset(model, state);
								this.emit('fetched', this);
							});
					}
				},
				save: {
					writable: false,
					enumerable: false,
					value: function(){
						return (this.id
							? ajax.put([url, this.id].join('/'), state)
							: ajax.post(url, state))
								.then(function(model){ 
									reset(model, state); 
									this.emit('saved', this);
								});
					}
				},
				remove: {
					writable: false,
					enumerable: false,
					value: function(){
						if(this.id){
							return ajax.delete([url, this.id].join('/'), state)
								.then(function(){ 
									reset({}, state); 
									this.emit('deleted', this);
								});
							}else{
								return Promise.reject('Can not remove model without id');
							}
					}
				}
			}
		};

		function Model(props){
			var state = {__changes: {} };

			if(this instanceof Model){
				// Ctor
				EventEmitter(this);

				Object.defineProperties(this, properties(state));
				Object.defineProperties(this, instanceMethods(state));
				if(props)
					for(var key in props)
						if(this.hasOwnProperty(key))
							this[key] = props[key];
			}else{
				return new Model(props);
			}
		};

		return Model;
	};
});