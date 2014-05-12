var format = require('util').format;

/**
 * Expose `Channel`.
 */

module.exports = Channel;

/**
 * Module dependencies.
 */

function Channel(opts) {
  if (!(this instanceof Channel)) return new Channel(opts);
  for (var i in opts) this[i] = opts[i];

  decorateLogger.call(this);

  this.client.on('join', this.onjoin.bind(this));
  this.client.on('quit', this.onquit.bind(this));
}


function decorateLogger() {
  var self = this, ol = self.log;
  var prepend = format('channel: %s: - ', self.name);
  self.log = {};

  ['debug', 'info', 'warn', 'error'].forEach(function (target) {
    self.log[target] = function() {
      if(arguments.length === 0) return;
      var args = Array.prototype.slice.call(arguments);
      args[0] = prepend + args[0];
      if(ol[target]) ol[target].apply(ol, args);
    };
  });
}

/**
 * Handle joins
 *
 * @api private
 */

Channel.prototype.onjoin = function(e) {
  if (e.channel != this.name) return;

  this.log.info('%s joined channel', this.client.me);
};

/**
 * Handle quits
 *
 * @api private
 */

Channel.prototype.onquit = function(e) {
  if (e.channel != this.name);

  this.log.info('%s quit channel', this.client.me);
};

/**
 * Handle mentions:
 *
 * @api private
 */

Channel.prototype.mentionedMessage = function(from, message) {
  var lm = message.length < 50 ? message : message.substring(0, 50);
  this.log.info('%s received the following mention in channel: %s', this.client.me, lm);


  // TODO: replace all this nonsense below with ChangeTip API calls
  var template = "%s, you've been sent %s milli-bitcoins (money) from %s. Collect it → %s ";

  // amount matches in message
  var amount_matches = message.match(/\d+/g) || [];

  // channel member matches in message
  var name_matches = [];
  for (var i in this.names) {
    var mentions = message.match(new RegExp(this.names[i], 'i')) || [];
    if(mentions) [].push.apply(name_matches, mentions);
	}

  if(amount_matches.length != 1) {
    this.send(from, 'Sorry, how much are you trying to tip?');
    return;
  }

  if(name_matches.length != 1) {
    this.send(from, "Sorry, I'm not sure who the intended recipient is.");
    return;
  }

  var interpolate = format(template, name_matches[0], amount_matches[0], from, 'http://www.changetip.com/some_url');

  // reply
  this.send(interpolate);
};

/**
 * Handle channel messages:
 *
 * @api public
 */

Channel.prototype.receive = function(from, message) {
  // ignore all but mentions
  if(message.toLowerCase().indexOf('changetip') < 0) return;

  this.mentionedMessage(from, message);
};


/**
 * Join the channel.
 *
 * @api public
 */

Channel.prototype.join = function() {
  this.client.join(this.name);
};

/**
 * Send a message to the channel.
 *
 * @api public
 */

Channel.prototype.send = function() {
  if(arguments.length > 1) {
    this.network.send(arguments[0], arguments[1]); // send private message to user in channel
    this.log.info('%s has sent a private message to %s which reads: %s', this.client.me, arguments[0], arguments[1]);
    return;
	}

  // send message to entire channel
  this.network.send(this.name, arguments[0]);
  this.log.info('%s has replied to a mention in channel with this: %s', this.client.me, arguments[0]);
};