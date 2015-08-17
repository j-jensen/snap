define(['application', 'model','view','dom'], function(Application, Model, View, $){

	function MyApp(){
		Application.apply(this, arguments);
	}
	MyApp.prototype = Object.create(Application.prototype);
	MyApp.prototype.constructor = MyApp;

	MyApp.prototype.start = function(){
		var Person = Model({
			defaults: {name: null, age: 0, state: 1},
			url: 'api/model'
		});
		
		var model = window.model = new Person({id:123});
		model.on('change', function(){console.debug(arguments)})
		  

		var view = new View({model:model, el:$('<div />'), bindings:{text:'name'}});
		view.mount(document.body);
		model.fetch();
		model.age++;
	};

	return MyApp;
});