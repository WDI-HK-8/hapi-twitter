var Joi = require('joi');
var Bcrypt = require('bcrypt');

exports.register = function(server, options, next) {
  server.route([
    {
      // Return all users
      method: 'POST',
      path: '/sessions',
      handler: function(request, reply) {
        var db = request.server.plugins['hapi-mongodb'].db;

        var user = {
          "username": request.payload.user.username,
          "password": request.payload.user.password
        };

        db.collection('users').findOne({ "username": user.username }, function(err, result) {
            if (err) {
              return reply('Internal MongoDB error', err); 
            }

            Bcrypt.compare(user.password, result.password, function(err, res) {
              reply(res);
            });
        })
      }
    }
  ]);

  next();
};

exports.register.attributes = {
  name: 'static-pages-route',
  version: '0.0.1'
};
