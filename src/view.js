define(['xquery'], function($){

	function View(config){
		var model = config.model;
		this.el = config.el;
		for(var binding in config.bindings){
			switch(binding){
				case 'text':
					var el =$(this.el).text(model[config.bindings[binding]]);
					model.on('change', function(e){
						if(e.name==config.bindings[binding])
							el.text(e.value);
					}.bind(this));
					break;
			}
		}
	}

	View.prototype.mount = function(parent){
		parent.appendChild(this.el);
	};
	return View;
});