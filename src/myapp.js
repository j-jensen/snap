define(['application', 'home-module', 'xquery'], function(Application, home, $){

	function MyApp(){
		Application.apply(this, arguments);
		this.on('all', function(){console.log(this, arguments);});
		this.module('home', home);
	}
	MyApp.prototype = Object.create(Application.prototype);

	MyApp.prototype.start = function(){
		Application.prototype.start.apply(this, arguments);
		this.module('home').start();
		$(document.body).append($('<div/>',{className:'abb'}).text('hello'));
	};

	return MyApp;
});