define(['event-emitter', 'promise', 'ajax'], function(EventEmitter, Promise, ajax){
	'use strict';

	return function(config){

		var properties = function(defaults, state){
			var props = {
				id: {
					enumerable: true,
					set: function(value){ state['id'] = value; },
					get: function(){ return state['id'] },
				},
				changes: {
					writable: false,
					value: state.__changes
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
								this.emit({
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
		}.bind(null, config.defaults),

		set = function(src, target){
			for(var key in src){
				target[key] = src[key];
			}
			target.__changes = {};
		},

		instanceMethods = function(state){
			return {
				fetch: {
					writable: false,
					enumerable: false,
					value: function(){
						var self = this;
						return Promise(function(fulfill, reject){
							ajax.get('api/model/' + self.id)
								.then(function(m){
									set(m, state)
									self.emit('fetched', self);
								})
								.catch(reject)
							});
					}
				},
				save:{
					writable: false,
					enumerable: false,
					value: function(){
						var self = this;
						return Promise(function(fulfill, reject){
							if(self.id){
								ajax.put('api/model/'+ self.id)
									.then(function(model){
										set(m, state)
										self.emit('updated', self);
									})
									.catch(reject);
							}else{
								ajax.post('api/model/new')
									.then(function(model){
										set(m, state)
										self.emit('updated', self);
									})
									.catch(reject);
							}
						});
					}
				}
			}
		};



		Model.prototype = {
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
				return new Model(attributes);
			}
		};

		return Model;
	};
});