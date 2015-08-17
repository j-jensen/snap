define(['dom'], function($){

	function View(config){
		var model = config.model;
		this.el = config.el.length ? config.el[0]:config.el;
		for(var binding in config.bindings){
			switch(binding){
				case 'text':
					var el = $(this.el).text(model[config.bindings[binding]]);
					model.on('change', function(e){
						if(e.name==config.bindings[binding])
							el.text(e.value);
					}.bind(this));
					break;
			}
		}
	}

	Object.defineProperties(View.prototype, {
		mount : {
			value: function(parent){
				parent.appendChild(this.el);
			}
		}
	})
	return View;
});