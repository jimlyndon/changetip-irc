var assert = require('assert')
  , express = require('express')
  , Resource = require('express-resource')
  , request = require('supertest')
  , batch = require('../support/batch');


describe('api', function(){

  it('should support nested REST routing', function(done){

    var app = express();

    app.use(function(req,res,next){
      req.networks = [
      {
        id: '1',
        host: '',
        port: '',
        realname: '',
        username: '',
        nickname: '',
        channels: [
          {
            id: '1',
            name: 'name1'
          }
        ]
      }];

      next();
    });

     var next = batch(done);
     var network = app.resource('networks', require('../../lib/api/networks'));
     var channel = app.resource('channels', require('../../lib/api/channels'));
     network.map(channel);

     request(app)
     .get('/networks')
     .expect([{
        id: '1',
        host: '',
        port: '',
        realname: '',
        username: '',
        currentnick: ''}], next());

     request(app)
     .get('/networks/1')
     .expect({
        id: '1',
        host: '',
        port: '',
        realname: '',
        username: '',
        currentnick: ''}, next());

     request(app)
     .get('/networks/1/channels')
     .expect([
          {
            id: '1',
            name: 'name1'
          }
        ], next());

      request(app)
     .get('/networks/1/channels/1')
     .expect({
            id: '1',
            name: 'name1'
          }, next());
   });
});