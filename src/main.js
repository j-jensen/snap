require.config({
	paths: {
		views:'../framework/views',
		underscore:'../node_modules/backbone/node_modules/underscore/underscore',
		jquery:'xquery'
	}
});

define(['myapp'], function(App){
	var app =__app =  new App(document.body);
	app.start();
});