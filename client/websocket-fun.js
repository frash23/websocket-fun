(function() {
	'use strict';

	/* Create and connect a websocket */
	var ws = new WebSocket('ws://127.0.0.1:6969/wss');
	ws.addEventListener('open', function() {
		
		ws.binaryType = 'arraybuffer';

		/* Since we're ready for action, let's make sure all messages are logged */
		ws.addEventListener('message', e=> {
			console.log(e);
			if(e.data.constructor === ArrayBuffer) {
				console.log(e.data);
				window.testbuf = e.data;
			}
		});

		/* Send a test message to the server */
		ws.send('I connected :)');

		window.testws = ws;
		window.closews = ws.close.bind(this);
	});

}).call({});

/*
 * 41943040
 *
 * */
