var assert = require("assert")
  , sinon = require('sinon')
  , irc = require('slate-irc')
  , Stream = require('stream').PassThrough
  , Network = require('../lib/bot/network')
  , Channel = require('../lib/bot/channel');

describe('channel', function() {
  var stream, client, network, channel;

  beforeEach(function() {
    stream = new Stream();
    client = irc(stream);
    network = new Network();
    channel = new Channel({
      client: client,
      name: 'somechannel',
      network: network,
      log : {}
    });
  });

  describe('on join', function() {
    it('should make a request to the irc Client to join the channel represented by itself', function() {
      var spy = sinon.spy();
      client.join = spy;

      channel.join();

      assert(spy.calledWith('somechannel'));
    });
  });

  describe('on send', function() {
    it('should make a request to Network to send a message to the channel represented by itself', function() {
      var message = 'message to channel';
      var spy = sinon.spy();
      network.send = spy;

      channel.send(message);

      assert(spy.called);
    });
  });
});