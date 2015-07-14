define(['event-emitter'],function(emitter){
	
	function Application(el){
		var modules = {};
		emitter(this);
		this.module = function(name, module){
			if(module){
				modules[name] = typeof module == 'function' ? module(this) : module;
				this.emit('module:add', name);
			}
			else{
				return modules[name];
			}
		};
	}

	Application.prototype.start = function(){
		console.log('Application start');
	};


	return Application;
});