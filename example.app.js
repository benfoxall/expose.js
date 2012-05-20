var expose = require('./lib/expose'),
    express = require('express'),
    app = express.createServer();
 
app.configure(function () {
	app.use(express.static(__dirname + '/example_public'));
});
 
app.listen(3000);


expose(app);


// var sio = expose.listen(app);
 
// sio.sockets.on('connection', function (socket) {
//     console.log('A socket connected!');
// });
