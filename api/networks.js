var express = require('express')
  , _ = require('lodash');

var router = express.Router();

/*
 * GET user
 */
router.get('/', function(req, res) {
  var hosts = _.map(req.networks, function(network) {
    return {
      host: network.host,
      port: network.port,
      realname: network.realname,
      username: network.username,
      currentnick: network.nickname
    };
  });

  res.json(hosts);
});

module.exports = router;