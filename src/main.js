require.config({
	paths: {
		views:'../framework/views',
		d:'../node_modules/event-emitter/node_modules/d/index'
	}
});

define(['myapp'], function(App){
	var app =__app =  new App(document.body);
	app.start();
});