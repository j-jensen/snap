define(['application', 'home-module', 'ajax'], function(Application, home, ajax){

	function MyApp(){
		Application.apply(this, arguments);
		this.on('all', function(){console.log(this, arguments);});
		this.module('home', home);
	}
	MyApp.prototype = Object.create(Application.prototype);
	MyApp.prototype.constructor = MyApp;

	MyApp.prototype.start = function(){
		Application.prototype.start.apply(this, arguments);
		this.module('home').start();

		ajax.post('http://www.onh3.dk/api/wai', {latitude: 60.398239499999995, longitude: 5.3268754, altitude: null})
		.then(function(resp){
			console.log(arguments);
		}).catch(function(){
			console.warn(arguments)});
	};

	return MyApp;
});