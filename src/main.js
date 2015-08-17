require.config({
	paths: {
		views:'../framework/views',
		dom:'xquery'
	}
});

define(['myapp'], function(App){
	var app =  new App(document.body);
	app.start();
});