const socket = io();

function onConnected() {
	console.log('Connected to server.');
	
	setTimeout(showLoginBox, 100);
}

function onDisconnected() {
	console.log('Disconnected from server.');
	showMessage('Conexão encerrada. Reconectando em 5 segundos...');
	
	window.setTimeout(function() { window.location = window.location; }, 5000);
}

function onRawMessageReceived(message) {
	console.log('Received a raw message from server: ' + message);
	showMessage(message);
}

function onLoginFailed() {
	console.log('Failed  to login');
	$('#login-feedback').show();
	enableElement('#login-btn');
	$('#login-btn').text('Entrar');
}

function onLoggedIn(data) {
	console.log('Logged in');
	console.log(data);
	
	$('#login-feedback').show();
	$('#login-feedback').removeClass('alert-danger');
	$('#login-feedback').addClass('alert-success');
	$('#login-feedback').html('Iniciando sessão...');
}

function handleSocketEvents() {
	console.log('Handling socket events.');
	
	socket.on('disconnect',		onDisconnected);
	socket.on('raw message',	onRawMessageReceived);
	socket.on('not logged in',	onLoginFailed);
	socket.on('logged in',		onLoggedIn);
	
	onConnected();
}

function showLoginBox() {
	$('#login-box').modal('show');
}

function showMessage(message) {
	$('#feedback').html(message);
}

function disableElement(target) { $(target).attr('disabled', 'disabled'); }
function enableElement(target) { $(target).removeAttr('disabled'); }

$(function () {
	$('#login-box').on('hidden.bs.modal', function(e) {
		socket.disconnect();
	});
	
	$('#login-form').on('submit', function(e) {
		
		var login_username = $('#login-user').val();
		var login_password = $('#login-password').val();
		
		var data = {
			username: login_username,
			password: login_password
		};
		
		socket.emit('login', data);
		disableElement('#login-btn');
		$('#login-btn').text('Entrando...');
		
		e.preventDefault();
	});
});

handleSocketEvents();