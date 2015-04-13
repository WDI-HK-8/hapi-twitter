var Joi = require('joi');

exports.register = function(server, options, next) {
  server.route([
    {
      // Return all users
      method: 'GET',
      path: '/',
      handler: function(request, reply) {
        reply("Home page");
      }
    }
  ]);

  next();
};

exports.register.attributes = {
  name: 'static-pages-route',
  version: '0.0.1'
};
