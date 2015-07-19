define(['promise'], function(Promise){

	var ajax = function(method, url, data){
		return Promise(function(fulfill, reject){
			var request = new XMLHttpRequest();
			request.onreadystatechange = handleReadyStateChange.bind(request, fulfill, reject);

			try{
				request.open(method, url, true);
				request.setRequestHeader('Content-Type', 'application/json');
				request.send(JSON.stringify(data));
			}
	        catch(ex){
	      		reject(ex);
	        }
		});
	},

	handleReadyStateChange = function(fulfill, reject) {
		if (this.readyState == 4) {
			if (this.status == 200) {
				try{
		        	fulfill(JSON.parse(this.responseText));
		        }
		        catch(ex){
		      		reject(ex);
		        }
		  	} else {
		  		reject(this);
		  	}
		}
	};

	return {
		get: ajax.bind(ajax, 'GET'),
		post: ajax.bind(ajax, 'POST'),
		put: ajax.bind(ajax, 'PUT'),
		delete: ajax.bind(ajax, 'DELETE')
	};
});