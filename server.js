var static = require('node-static');
 
//
// Create a node-static server instance to serve the './public' folder
//
var file = new static.Server('.');
 
var app = require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        //
        // Serve files!
        //
        file.serve(request, response);
    }).resume();
})
var io = require('socket.io')(app);

app.listen(8080);

// note, io(<port>) will create a http server for you

io.on('connection', function (socket) {
  
	console.log('Got a new client');
	socket.emit('connection', "connection");
	socket.on('message', function (from, msg) {
		console.log('I received a private message by ', from, ' saying ', msg);
	});



	socket.on('disconnect', function () {
		io.emit('user disconnected');
	});
});