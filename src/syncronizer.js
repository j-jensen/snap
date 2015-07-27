define(['ajax'], function(ajax){

	function Syncronizer(){

	}

	Syncronizer.prototype.start = function(model){
		model.on('change', function(event){
			console.log(model.changes);
		});
	};

	return Syncronizer;
});