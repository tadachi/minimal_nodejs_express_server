var express 		= require('express');
var bodyParser 		= require('body-parser');
var methodOverride  = require('method-override');
var app 			= express()
var port			= parseInt(process.env.PORT, 10) || 4000;
var fs 				= require('fs');
var path			= require('path');
var router 			= express.Router();
var vhost 			= require('vhost');
var io 				= require('socket.io').listen(port);

app.use(bodyParser());
app.use(methodOverride());
app.listen(port);

/* Initialize express. */
var home = express();
home.use(express.static(__dirname + '/app/'));

/* Set virtual host to your website. */
app.use(vhost('www.yoursite.com', home));

/* Outputs the users visiting your website and keeps a count */
var count = 0
io.sockets.on('connection', function (socket) {
	var endpoint = socket.manager.handshaken[socket.id].address;
	console.log('Client connected from: ' + endpoint.address + ":" + endpoint.port);
  
	count++;
	io.sockets.emit('message', { count: count });

	io.sockets.on('disconnect', function(){
		count--;
		io.sockets.emit('message', { count: count });
	})
});

/* Debug */
console.log(__dirname);
console.log(__dirname + '/app/');
console.log('Listening on port: ' + port);
