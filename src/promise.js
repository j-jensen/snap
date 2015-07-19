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
				promise.fulfillArguments = Array.prototype.slice.call(arguments, 0);

				promise.fulfill.forEach(function(fulfill){
					_callOrApply(this, fulfill, promise.fulfillArguments);
				}, this);
				promise.state = 'fulfilled';
			}.bind(this),
			function(){
				promise.rejectArguments = Array.prototype.slice.call(arguments, 0);

				promise.reject.forEach(function(reject){
					_callOrApply(this, reject, promise.rejectArguments);
				}, this);
				promise.state = 'rejected';
			}.bind(this));
	}
	var _callOrApply = function(context, func, args){
		args.length > 1 ?
			func.apply(context, args) :
			args.length > 0 ?
				func.call(context, args[0]) :
				func.call(context);
	};

	var _then = function(promise, fulfill, reject){
		switch(promise.state){
			case 'fulfilled':
				_callOrApply(this, fulfill, promise.fulfillArguments);
				break;
			case 'rejected':
				if(reject)
					_callOrApply(this, reject, promise.rejectArguments);
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
			_callOrApply(this, reject, promise.rejectArguments);
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
						resolved[idx] = arguments.length > 0 ? arguments[0] : null;
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
		var resolve = new Promise(function(fulfill){
			fulfill.call(resolve, value);
		});
		return resolve;
	};

	return Promise;
});