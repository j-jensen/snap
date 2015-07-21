define(['event-emitter', 'promise'], function(EventEmitter, Promise){
	'use strict';

	return function(config){

		var properties = function(defaults, state){
			var props = {
				id: {
					enumerable: true,
					set: function(value){ state['id'] = value; },
					get: function(){ return state['id'] },
				},
				attributes: {
					writable: false,
					value: state
				}
			};
			for(var key in defaults){
				(function(key){
					state[key] = defaults[key],
					props[key] = {
						enumerable: true,
						set: function(val){
							if(val != state[key]){
								this.emit('change:' + key, val, state[key]);
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
		}.bind(null, config.defaults);

		function Model(props){
			var state = {};
			if(this instanceof Model){
				// Ctor
				EventEmitter(this);
				Object.defineProperties(this, properties(state));
				if(props)
					for(var key in props)
						if(this.hasOwnProperty(key))
							this[key] = props[key];
			}else{
				return new Model(attributes);
			}
		};

		Model.prototype.fetch = function(){
			console.log('fetching from server...');
			return Promise.resolve(this);
		};

		Model.prototype.save = function(){
			var model = this;
			if(this.id){
				return Promise(function(fulfill, reject){
					model.emit('updated', model);
					fulfill(model);
				});
			}else{
				return Promise(function(fulfill, reject){
					model.id=123;
					model.emit('created', model);
					fulfill(model);
				});
			}
		};

		Model.prototype.destroy = function(){
			var model = this;

			return Promise(function(fulfill, reject){
				model.emit('destroyed', model);
				fulfill(model);
			});
		};

		return Model;
	};
});