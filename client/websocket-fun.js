(function() {
	'use strict';

	/* Create and connect a websocket */
	var ws = new WebSocket('ws://127.0.0.1:6969/wss');
	ws.addEventListener('open', function() {
		
		/* Since we're ready for action, let's make sure all messages are logged */
		ws.addEventListener('message', function() { console.log(arguments) });

		/* Send a test message to the server */
		ws.send('I connected :)');
	});

}).call({});
