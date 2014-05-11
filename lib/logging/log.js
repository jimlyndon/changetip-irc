/**
 * Module dependencies.
 */

var Log = require('./logger');

// initialize

var log = new Log({
	path: '/tmp/changecoin.log'
});

module.exports = log;