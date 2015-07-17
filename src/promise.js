define([], function(){
	'use strict';

	function Promise(executor){
		if(!(this instanceof Promise))
			return new Promise(executor);

		var promise = {
			state: 'pending',
			fulfill: [],
			fulfillArguments: [],
			reject: [],
			rejectArguments: [],
		};
		Object.defineProperties(this, props(this, promise));

		executor(function(){
			var args = Array.prototype.slice.call(arguments);

			promise.fulfill.forEach(function(fulfill){
				fulfill.apply(this, promise.fulfillArguments = args);
			}, this);
			promise.state = 'fulfilled';
		}.bind(this),
		function(){
			var args = Array.prototype.slice.call(arguments);
			promise.reject.forEach(function(reject){
				reject.apply(this, promise.rejectArguments = args);
			}, this);
			promise.state = 'rejected';
		}.bind(this));
	}

	var _then = function(promise, fulfill, reject){
		switch(promise.state){
			case 'fulfilled':
				fulfill.apply(this, promise.fulfillArguments);
				break;
			case 'rejected':
				reject.apply(this, promise.rejectArguments);
				break;
			case 'pending':
				promise.fulfill.push(fulfill);
				promise.reject.push(reject);
				break;
		}
		return this;
	},

	_catch = function(promise, reject){
		if(promise.state == 'rejected')
			promise.reject.apply(this, promise.rejectArguments);
		else
			promise.reject.push(reject);
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

	Promise.all = function(){
		var promises = Array.prototype.slice.call(arguments);

		var all = new Promise(function(fulfill, reject){
			var resolved = [];

			promises.forEach(function(promise, idx){
				promise.then(
					function(){
						resolved[idx] = arguments;
						if(resolved.filter(function(e){return typeof e != 'undefined'}).length==promises.length)
							fulfill.apply(all, resolved);
					},
					function(){
						reject.apply(all, arguments);						
					});
			});
		});
		return all;
	};

	Promise.race = function(){
		var promises = Array.prototype.slice.call(arguments);

		var race = new Promise(function(fulfill, reject){
			promises.forEach(function(promise, idx){
				promise.then(
					function(){
						fulfill.apply(all, arguments);
					},
					function(){
						reject.apply(all,arguments);						
					});
			});
		});
		return race;
	};

	Promise.resolve = function(value){
		return new Promise(function(fulfill){
			fulfill(value);
		});
	};

	return Promise;
});