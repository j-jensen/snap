define([], function(){
	'use strict';

	// Main constructor. Takes an executor of type function
	function Promise(executor){
		if(!(this instanceof Promise))
			return new Promise(executor);

		var instance = {
			state: 'pending',
			fulfill: [],
			fulfillArguments: [],
			reject: [],
			rejectArguments: [],
		};
		Object.defineProperties(this, props(this, instance));

			executor(function(){
				instance.fulfillArguments = Array.prototype.slice.call(arguments, 0);

				instance.fulfill.forEach(function(fulfill){
					_callOrApply(this, fulfill, instance.fulfillArguments);
				}, this);
				instance.state = 'fulfilled';
			}.bind(this),
			function(){
				instance.rejectArguments = Array.prototype.slice.call(arguments, 0);

				instance.reject.forEach(function(reject){
					_callOrApply(this, reject, instance.rejectArguments);
				}, this);
				instance.state = 'rejected';
			}.bind(this));
	}

	var _callOrApply = function(context, func, args){
		if(typeof func != 'function')return;

		args.length > 1 ?
			func.apply(context, args) :
			args.length > 0 ?
				func.call(context, args[0]) :
				func.call(context);
	};

	var _then = function(instance, fulfill, reject){
		switch(instance.state){
			case 'fulfilled':
				_callOrApply(this, fulfill, instance.fulfillArguments);
				break;
			case 'rejected':
				if(reject)
					_callOrApply(this, reject, instance.rejectArguments);
				break;
			case 'pending':
				instance.fulfill.push(fulfill);
				if(typeof reject == 'function')
					instance.reject.push(reject);
				break;
		}
		return this;
	},

	_catch = function(instance, reject){
		if(instance.state == 'rejected')
			_callOrApply(this, reject, instance.rejectArguments);
		else
			instance.reject.push(reject);
	},

	props = function(self, state){
		return {
			then:{
				value: _then.bind(self, state)
			},
			catch:{
				value: _catch.bind(self, state)
			}
		}
	};

	// Static methods
	// all is resolved when all arguments are resolved (AND)
	Promise.all = function(){
		var promises = Array.prototype.slice.call(arguments);

		var all = new Promise(function(fulfill, reject){
			var resolved = [];

			promises.forEach(function(promise, idx){
				promise = typeof promise.then == 'function' ? promise : Promise.resolve(promise);
				promise.then(
					function(){
						resolved[idx] = arguments.length > 0 ? arguments[0] : null;
						if(resolved.filter(function(e){return typeof e != 'undefined'}).length==instances.length)
							fulfill.apply(all, resolved);
					},
					function(){
						reject.apply(all, arguments);						
					});
			});
		});
		return all;
	};

	// race resolves when the first promise resolves (OR)
	Promise.race = function(){
		var promises = Array.prototype.slice.call(arguments);

		var race = new Promise(function(fulfill, reject){
			promises.forEach(function(promise){
				promise = typeof promise.then == 'function' ? promise : Promise.resolve(promise);
				promise.then(
					function(){
						fulfill.apply(race, arguments);
					},
					function(){
						reject.apply(race, arguments);						
					});
			});
		});
		return race;
	};

	// resolve returns a resolved promise
	Promise.resolve = function(value){
		var resolve = new Promise(function(fulfill){
			fulfill.call(resolve, value);
		});
		return resolve;
	};

	return Promise;
});