define([], function(){
	'use strict';

	var PENDING = 'pending', FULFILLED = 'fulfilled', REJECTED = 'rejected';


	// Main constructor. Takes an executor of type function
	function Promise(executor){
		if(typeof executor != 'function')
			throw new Error('Promise executor is not a function');
		if(!(this instanceof Promise))
			return new Promise(executor);

		var _state = PENDING,
			_value = null,
			_onFulfilled,
			_onRejected;

		Object.defineProperty(this, 'state', {
			get: function(){ return _state; }
		});

		executor(function(value){
				if(_state != PENDING)return;

				_value = value;
				_state = FULFILLED;
				if(_onFulfilled)
					_onFulfilled(_value);
			},
			function(error){
				if(_state != PENDING)return;

				_value = error;
				_state = REJECTED;
				if(_onRejected)
					_onRejected(_value);
			});

		this.then = function(onFulfilled, onRejected){

			switch(_state){
				case FULFILLED:
					if(typeof onFulfilled != 'function')
						return this;

					return Promise.fulfill(onFulfilled(_value));
				
				case REJECTED:
					if(typeof onRejected != 'function')
						return this;

					return Promise.reject(onRejected(_value));

				case PENDING:
					onFulfilled && (_onFulfilled = onFulfilled);
					onRejected && (_onRejected = onRejected);

					return new Promise(function(fulfill, reject){
						if(typeof _onFulfilled == 'function'){
							var outer = _onFulfilled;
							_onFulfilled = function(value){ fulfill(outer(value)); };
						}else{
							_onFulfilled = fulfill;
						}
					});
			}
		};
	}


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

	Promise.reject = function(error){
		var reject = new Promise(function(fulfill, reject){
			reject.call(reject, error);
		});
		return reject;
	};

	Promise.deferred = function(){
		var _fulfill, 
			_reject,
			_promise = new Promise(function(fulfill, reject){
				_fulfill = fulfill;
				_reject = reject;
			});
		
		return {
			resolve: _fulfill,
			reject: _reject,
			promise: promise
		}
	};

	return Promise;
});