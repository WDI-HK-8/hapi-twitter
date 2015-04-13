var Hapi = require('hapi');
var server = new Hapi.Server();

server.connection({
  host: '0.0.0.0',
  port: process.env.PORT || 3000
});

server.route({
  method: 'GET',
  path: '/',
  handler: function(request, reply) {
    reply("hello world");
  }
});

server.start();