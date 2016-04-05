#!/usr/bin/env node
'use strict';

const fs = require('fs');
const http = require('http');
const WebSocket = require('ws');

const util = require('./util.js');

/* Config is stored in a JS file for convenience for both end users and developers */
var config = require('./config.js');
const wroot = './client/';

/* Create the test HTTP server */
var httpServer = http.createServer( (req, res)=> {
	
	/* A basic webserver, good enough for our testing. */ 
	var path = req.url === '/'? '/index.html' : req.url;
	var fullpath = wroot + path;

	fs.access(fullpath, fs.R_OK, err=> {

		if(err) res.end(err.msg);
		else fs.readFile(fullpath, { encoding: 'utf-8' }, (err, data)=> {

			if(err) res.end(err.msg);
			else res.end(data);
		});
	});
});

/* Create the actual websocket server */
const ws = new WebSocket.Server({ server: httpServer, path: '/wss' });

/* An array to let us keep track of connected sockets 
 * wsIds<int id, WebSocket socket>*/
var wsIds = {};

/* Make it do stuff when a socket is connected */
ws.on('connection', ws=> {

	/* Generate a unique id for and assign it to the socket id map as well as the ws object
	 * The ID can safely be cast to a 32bit integer in case you need to store it in a compact
	 * database with a constrained bit length */
	var id;
	do id = util.randomUint32(); while(wsIds[id]);
	wsIds[id] = ws;
	if(!ws.id) ws.id = id;
	console.log( Object.keys(wsIds) );

	//console.log('New connection: ', ws);
	var array = new Float32Array(1024 * 1024);
	for(let i=0; i<array.length; i++) array[i] = i/2;

	var header = util.constructTPCheader(69, { compress: true });
	var testPacket = new Uint16Array([header, 87, 101, 108, 99, 111, 109, 101, 32, 116, 111, 32, 116, 104, 101, 32, 116, 101, 97, 109]);

	ws.on( 'message', msg=> console.log('message from ' + ws.id + ':', msg) );
	ws.send(testPacket, { binary: true });
	//ws.send('Welcome to the team', { binary: true });
	//ws.send(array, { binary: true, compress: true });
	
	ws.on('close', ()=> {
		console.log('Client ' + id + ' has disconnected');
		wsIds[id] = null;
	});
});

/* Listen the HTTP server on the values defined in the config */
httpServer.listen( config.port, config.host, e=> console.log('Listening on network') );
