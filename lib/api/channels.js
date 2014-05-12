var _ = require('lodash');

exports.index = {
  json: function(req, res) {
    var hosts = _.map(req.network.channels, function(channel) {
      return {
        id: channel.id,
        name: channel.name
      };
    });

    res.send(hosts);
  }
};

exports.show = {
  json: function(req, res) {
    channel = req.channel;
    res.send({
      id: channel.id,
      name: channel.name
    });
  }
};

exports.load = function(req, id, fn) {
  var channel = _.find(_.find(req.networks, { 'id': req.params.network })
    .channels, { 'id': id });

  if (!channel) return fn(new Error('not found'));

  process.nextTick(function() {
    fn(null, channel);
  });
};