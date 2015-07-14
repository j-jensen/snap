define([], function(){
	function MainLayout(config){
		for(var k in config)config.hasOwnProperty(k) && (this[k] = config[k]);
	};
	MainLayout.prototype.attach = function(el){
		this.el = el;
	}
	MainLayout.prototype.show = function(where, view){
		if(!this[where])throw new Error('Unknown bucket: '+where);		
	}

	return MainLayout;
});