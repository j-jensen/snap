define(['application', 'home-module', 'promise'], function(Application, home, Promise){

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

		Promise.all(Promise(function(resolve, reject){
			window.setTimeout(
                function() {
                    // We fulfill the promise !
                    resolve('Hello promise 1');
                },  3000);
			}),
			Promise(function(resolve, reject){
	                    throw new Error('Argh...');
				window.setTimeout(
	                function() {
	                    // We fulfill the promise !
	                    resolve('Hello promise 2');
	                },  1000);
				}),
			Promise.resolve('Hello 3')
		).then(function(hello1, hello2, hello3){
			console.log(arguments);
		}).catch(function(){
			console.warn(arguments)});
	};

	return MyApp;
});