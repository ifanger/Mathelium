var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
var config = {
	timeout: 5
};

server.listen(port, function () {
	console.log('Server listening at port %d', port);
});

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', function(socket) {
	console.log('New connection found');
	socket.mdata = {};
	var client = socket.mdata;
	
	
	function onConnect() {
		// Store the last ping of the client
		client.lastPing = getCurrentTimeInSeconds();
		
		socket.on('disconnect', onDisconnect);
		socket.on('ping', onPing);
	}
	
	function onDisconnect() {
		console.log('Disconnected');
	}
	
	function onPing() {
		console.log('I\'ve got a ping');
		client.lastPing = getCurrentTimeInSeconds();
		socket.emit('raw message', 'Pong! ' + client.lastPing);
	}
	
	// Verify the last client's ping and check if the connection still alive
	function checkPing() {
		console.log('ping verification');
		if(client.lastPing <= (getCurrentTimeInSeconds() - config.timeout))
		{
			console.log('timed out');
			socket.emit('raw message', 'Você foi expulso do jogo.');
			io.emit('disconnected');
		}
	}
	
	socket.emit('raw message', 'Bem-vindo.');
	setInterval(checkPing, 1000 * config.timeout);
});

function getCurrentTimeInSeconds() { return Math.floor(Date.now() / 1000); }