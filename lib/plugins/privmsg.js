/** Monkey patch for slate-irc, which doesn't emit the appropriate privmsg event **/

var utils = require('./utils.js');

module.exports = function(){
	return function(irc){
		irc.on('data', function(msg){
			if ('PRIVMSG' != msg.command) return;

			irc.emit('privmsg', {
				from : utils.nick(msg),
				to: msg.params.toLowerCase(),
				message: msg.trailing
			});
		});
	}
}