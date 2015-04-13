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
              if (res) {
                
                // if password matches, please authenticate user and add to cookie
                Bcrypt.genSalt(10, function(err, salt) {
                  Bcrypt.hash('B4c0/\/', salt, function(err, hash) {
                    request.session.set('example', { key: hash });
                    return reply("Signed in");
                  });
                });
              };
            });
        })
      }
    },
    {
      method: 'GET',
      path: '/temp',
      handler: function(request, reply) {
        var example = request.session.get('example');
        reply(example.key);
      }
    }
  ]);

  next();
};

exports.register.attributes = {
  name: 'static-pages-route',
  version: '0.0.1'
};
