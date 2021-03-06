var express = require('express')
  , Resource = require('express-resource')
  , Network = require('./lib/bot/network')
  , log = require('./lib/logging/log');

var msg = 'Booting up irc bot and api endpoints';
log.info(msg);
console.log(msg);

// Load all configs
var boptions = [];
require("fs").readdirSync("./bootstrap").forEach(function(file) {
  var config = require("./bootstrap/" + file);
  if(Object.keys(config).length !== 0) boptions.push(config);
});

// API state
var state = {
  networks: []
};

// Join irc networks
boptions.forEach(function(opts) {
  log.info('connect to %s:%s', opts.host, opts.port);
  opts.log = log;

  var nw = new Network(opts);
  nw.connect();
  state.networks.push(nw);

  opts.channels.forEach(function(channel) {
    nw.join(channel);
  });
});

// Rest API for external querying
var api = express();

// config CORS middleware
// TODO: eventually restrict this to our specific domain
api.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET'); //,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
});

// Make our irc bot data available to our API
api.use(function(req,res,next){
  req.networks = state.networks;
  next();
});

var network = api.resource('networks', require('./lib/api/networks'));
var channel = api.resource('channels', require('./lib/api/channels'));
network.map(channel);

// Catch 404 and forwarding to error handler
api.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Start api listener
var apiport = Number(process.env.PORT || 5000);
api.listen(apiport);

msg = 'API listening on port ' + apiport + '...';
log.info(msg);
console.log(msg);