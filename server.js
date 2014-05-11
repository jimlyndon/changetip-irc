var Network = require('./lib/network');
var log = require('./lib/logging/log');
var express = require('express');
var networks = require('./api/networks');

log.info('boot');


var options = [
	{
		port: 6697, // ssl - not every irc network supports ssl
		host: 'irc.freenode.org',
		nickname: 'ChangeTip',
		username: process.env.USER,
		realname: process.env.USER,
		password: process.env.CRED,
		secure: true
	}

// need to figure out why QuakeNet isn't allowing auto channel joins onconnect
//	{
//		port: 6667, // http
//		host: 'blacklotus.ca.us.quakenet.org',
//		nickname: 'ChangeTip',
//		username: process.env.USER,
//		realname: process.env.USER,
//		password: process.env.CRED
//	}
];

var state = {
	networks: []
};

options.forEach(function(opts) {
	log.info('connect to %s:%s', opts.host, opts.port);
	opts.log = log;

	var nw = new Network(opts);
	nw.connect();
	state.networks.push(nw);

	nw.join('#changetip');
	nw.join('#changecoin');
});




// Rest API for external querying
var api = express();

// Make our irc bot data available to our API
api.use(function(req,res,next){
	req.networks = state.networks;
	next();
});

// api.use('/', status);
api.use('/networks', networks);
api.use('/networks/:id', networks);

// catch 404 and forwarding to error handler
api.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

api.listen(3333);

console.log('Listening on port 3333...');