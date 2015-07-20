define(['application', 'model'], function(Application, Model){

	function MyApp(){
		Application.apply(this, arguments);
	}
	MyApp.prototype = Object.create(Application.prototype);
	MyApp.prototype.constructor = MyApp;

	MyApp.prototype.start = function(){
		var Person = Model({defaults: {name: null, age: 0, state: 1}});
		model = new Person({name: 'Jesper', age: 45});
		model2 = new Person({name: 'Kari', age: 45});

		model.on('all', function(){console.log(this, arguments);});
		model2.on('all', function(){console.log(this, arguments);});

		model.age++;
		model2.state = 'Lovly';
	};

	return MyApp;
});