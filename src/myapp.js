define(['application', 'home-module'], function(Application, home){

	function MyApp(){
		Application.apply(this, arguments);
		this.on('all', function(){console.log(this, arguments);});
		this.module('home', home);
	}
	MyApp.prototype = Object.create(Application.prototype);

	MyApp.prototype.start = function(){
		Application.prototype.start.apply(this, arguments);
		this.module('home').start();
	};

	return MyApp;
});