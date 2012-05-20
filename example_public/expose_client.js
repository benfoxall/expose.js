window.expose = function(){

	var socket = window.s = io.connect('http://localhost');

	var requestID = 0;
	var responseCallbacks = window.rc = {};

	var callbacks = {};
	// trendy callback style
	return function(urlcb){
		callbacks.url = urlcb;
		return function(devicecb){
  		callbacks.device = devicecb;
	  	init();
		}
	}

	function init(){
	socket.emit('consume');
  	socket.on('url', callbacks.url);
  	socket.on('device', function(device){
  		// replace __fn__ with proxy functions
  		var proxed = (function recurse(obj, path){
  			if(obj === '__fn__'){
  				return function(fn){
  					console.log("PROXY", path);
  					//arguments aren't given for now
  					requestID++;
  					responseCallbacks[requestID] = fn;
  					socket.emit('request', requestID, path);
  				}
  			} else if(obj === new Object(obj)){
  				var nobj = {};
  				for(var i in obj){
  					nobj[i] = recurse(obj[i],path + '.' + i);
  				}
  				return nobj;
  			} else {
  				return obj;
  			}

  		})(device,'');

  		callbacks.device(proxed)
  	});
  	socket.on('response', function(i,args){
  		console.log("GOT BACK", i, args);
  		responseCallbacks[i].apply(this,args);
  		responseCallbacks[i] = null;
  	})
	}

};