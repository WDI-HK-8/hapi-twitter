var Joi = require('joi');

exports.register = function(server, options, next) {
  server.route([
    {
      // Return all users
      method: 'GET',
      path: '/users',
      handler: function(request, reply) {
        reply("All users");
      }
    }
  ]);

  next();
};

exports.register.attributes = {
  name: 'users-route',
  version: '0.0.1'
};
