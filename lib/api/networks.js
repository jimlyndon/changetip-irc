var _ = require('lodash');

exports.index = {
  json: function(req, res) {
    networks = req.networks;
    var hosts = _.map(networks, function(network) {
      return {
        id: network.id,
        host: network.host,
        port: network.port,
        realname: network.realname,
        username: network.username,
        currentnick: network.nickname
      };
    });

    res.send(hosts);
  }
};

exports.show = {
  json: function(req, res) {
    network = req.network;
    res.send({
      id: network.id,
      host: network.host,
      port: network.port,
      realname: network.realname,
      username: network.username,
      currentnick: network.nickname
    });
  }
};

exports.load = function(req, id, fn) {
  var network = _.find(req.networks, { 'id': id });
  if (!network) return fn(new Error('not found'));

  process.nextTick(function() {
    fn(null, network);
  });
};