
/**
 * Module dependencies.
 */

var irc = require('slate-irc'),
	fs = require('fs'),
	net = require('net'),
	tls  = require('tls'),
	privmsg = require('./plugins/privmsg'),
	Channel = require('./channel'),
	format = require('util').format;

/**
 * Expose `Network`.
 */

exports = module.exports = Network;

/**
 * Initialize a new network.
 *
 * @param {Object} opts
 */

function Network(opts) {
	if (!(this instanceof Network)) return new Network(opts);
	for (var i in opts) this[i] = opts[i];

	decorateLogger.call(this);

	this.channels = {};
}

function decorateLogger() {
	var self = this, ol = self.log;
	var prepend = format('network: %s:%s - ', self.host, self.port);
	self.log = {};

	['debug', 'info', 'warn', 'error'].forEach(function (target) {
		self.log[target] = function() {
			if(arguments.length == 0) return;
			var args = Array.prototype.slice.call(arguments);
			args[0] = prepend + args[0];
			ol[target].apply(ol, args);
		};
	})
}


/**
 * Build stream.
 *
 * @return {Stream} - via net or tsl (for irc servers that support ssl)
 * @api private
 */

Network.prototype.stream = function() {
	if(this.secure)
		return this.stream = tls.connect({
			port: this.port,
			host: this.host,
			rejectUnauthorized : this.false // we'll change this if we set up certificates
		});

	return this.stream = net.connect({
		port: this.port,
		host: this.host
	});
}

/**
 * Handle names listing when auto joining channels on network connection
 *
 * @api private
 */

Network.prototype.onnames = function(msg) {
	this.log.debug('channel %s has %s users', msg.channel, msg.names.length);

	// don't include me in the list of names
	var meIndex = msg.names.indexOf(this.client.me);
	if(meIndex != -1) msg.names.splice(meIndex, 1);

	this.channels[msg.channel].names = msg.names;
};

/**
 * Handle messages
 *
 * @api private
 */

Network.prototype.onprivmsg = function(msg) {
	var to = msg.to.toLowerCase(),
		me = this.client.me.toLowerCase();

	if(to === me)
		// if msg directed to me, send a direct message back
		this.send(msg.from, 'hey ' + msg.from + ', what you want?');
	else // channel wide message
		this.channels[to].receive(msg.from, msg.message);
};

/**
 * Make network.
 *
 * @api public
 */

Network.prototype.connect = function() {
	this.client = irc(this.stream());

	// TODO: send pull-req to TJ about patch.
	this.client.use(privmsg()); // patch slate_irc plugin

	this.client.on('names', this.onnames.bind(this));
	this.client.on('privmsg', this.onprivmsg.bind(this));

	// TODO: remove this eventually
//    // view raw IRC codes/messages over the wire
//	var self = this;
//	this.client.on('data', function(event) {
//		self.log.debug('DATA event: %s', JSON.stringify(event));
//	});

	this.authenticate();
};

/**
 * Authenticate with the server.
 *
 * @api public
 */

Network.prototype.authenticate = function() {
	if (this.password) {
		this.log.info('connect with password');
		this.client.pass(this.password);
	}

	this.client.nick(this.nickname);
	this.client.user(this.username, this.realname);
	this.log.info('user %s is now connected with nick: %s', this.username, this.nickname);
};

/**
 * Join `channel`.
 *
 * @param {String} chan
 * @return {Channel}
 * @api public
 */

Network.prototype.join = function(chan) {
	chan = chan.toLowerCase();

	chan = new Channel({
		client: this.client,
		network: this,
		name: chan,
		log: this.log
	});

	this.channels[chan.name] = chan;

	chan.join();

	return chan;
};

/**
 * Send `msg` to `target`.
 *
 * @param {String} target
 * @param {String} msg
 * @api public
 */

Network.prototype.send = function(target, msg) {
	this.log.info('send %s `%s`', target, msg);
	this.client.send(target, msg);
};