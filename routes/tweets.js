var Joi = require('joi');

exports.register = function(server, options, next) {
  server.route([
    {
      method: 'GET',
      path: '/',
      handler: function(request, reply) {
        reply("hello world");
      }
    }
  ]);

  next();
}

exports.register.attributes = {
  name: 'tweets-route',
  version: '0.0.1'
};

