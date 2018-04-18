var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
var config = {
	timeout: 30
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
		socket.on('disconnect',		onDisconnect);
		socket.on('login',			onLogin);
	}
	
	function onLogin(user) {
		console.log('Trying to login ' + user.username + ' with pass: ' + user.password);
		var auth = false;
		
		if(user.username == 'Niunzin' && user.password == '123')
			auth = true;
		
		if(auth) {
			socket.user = {
				name: 'Niunzin',
				level: 0,
				experience: 0,
				title: 0
			};
			
			socket.emit('logged in');
		} else {
			socket.emit('not logged in');
		}
	}
	
	function onDisconnect() {
		console.log('Disconnected');
	}
	
	onConnect();
	
	socket.emit('raw message', 'Bem-vindo.');
});

function getCurrentTimeInSeconds() { return Math.floor(Date.now() / 1000); }