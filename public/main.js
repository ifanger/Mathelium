var socket = io();

function onRawMessageReceived(message) {
	$('#feedback').html(message);
}

function handleSocketEvents() {
	console.log('Handling socket events');
	
	socket.on('raw message', onRawMessageReceived);
}

handleSocketEvents();