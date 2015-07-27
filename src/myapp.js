define(['application', 'model','syncronizer'], function(Application, Model, Sync){

	function MyApp(){
		Application.apply(this, arguments);
	}
	MyApp.prototype = Object.create(Application.prototype);
	MyApp.prototype.constructor = MyApp;

	MyApp.prototype.start = function(){
		var Person = Model({defaults: {name: null, age: 0, state: 1}});
		
		var model = window.model = new Person({id:123});
		model.on('all',function(){console.log(arguments)});
		model.fetch();

		model.age++;

	};

	return MyApp;
});