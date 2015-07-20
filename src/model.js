define(['event-emitter'], function(EventEmitter){
	'use strict';

	return function(config){

		var properties = function(defaults, state){
			var props = {
				$state: {
					writable: false,
					value:state
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

		return Model;
	};
});