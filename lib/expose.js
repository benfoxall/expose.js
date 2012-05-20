var io = require('socket.io');

var id = 0;

// this is very badly designed,
// as it doesn't get cleaned up when 
// someone disconnects,  though it
// will do for a demo
var socketMap = {};

module.exports = function(app){

	// io.listen(app);

	var sio = io.listen(app);
	 
	sio.sockets.on('connection', function (socket) {
	    console.log('A socket connected!');

	    socket.on('echo', function(echo){
	    	console.log("echo", echo)
	    })

		socket.on('consume', function(){
			// the socket is from the browser
			console.log("-----CONSUMER");
			id++;

			// get ready for a device to connect
			socketMap[id] = socket;

			socket.emit('url','http://192.168.0.4:3000/?' + id);	


		});

		socket.on('expose', function(id, obj){
			console.log("-----DEVICE")
			if(socketMap[id]){
				var target = socketMap[id];
				target.emit('device', obj);
				//link them up
				target.set('link', socket);
				socket.set('link', target);
				socketMap[id] = null;
			} else {
				console.error("Couldn't find socket to expose to")
			}
			// the socket is from the android device
		});

		socket.on('request', function(i,what){
			socket.get('link', function(err,link){
				link.emit('request', i, what);
			});
		});

		
		socket.on('response', function(i,what){
			socket.get('link', function(err,link){
				link.emit('response', i, what);
			});
		});



		socket.emit('hello');

	});

	console.log("expose is listening")

}