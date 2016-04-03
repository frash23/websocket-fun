#!/usr/bin/env node
'use strict';

const fs = require('fs');
const http = require('http');
const WebSocket = require('ws');

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

/* Make it do stuff when a socket is connected */
ws.on('connection', ws=> {
	console.log('New connection: ', ws);

	ws.on( 'message', msg=> console.log('message from ' + ws + ':', msg) );
	ws.send('Welcome to the team');
});

/* Listen the HTTP server on the values defined in the config */
httpServer.listen( config.port, config.host, e=> console.log('Listening on network') );
