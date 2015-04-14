var Joi = require('joi');
var Bcrypt = require('bcrypt');
var Auth = require('./auth');

exports.register = function(server, options, next) {

  server.route([
    {
      // Return all users
      method: 'POST',
      path: '/sessions',
      handler: function(request, reply) {
        var db = request.server.plugins['hapi-mongodb'].db;

        // TODO: Add email authentication (optional)
        var user = {
          "username": request.payload.user.username,
          "password": request.payload.user.password
        };

        db.collection('users').findOne({ "username": user.username }, function(err, userMongo) {
            if (err) { return reply('Internal MongoDB error', err); }

            Bcrypt.compare(user.password, userMongo.password, function(err, res) {
              if (res) {

                // if password matches, please authenticate user and add to cookie
                Bcrypt.genSalt(10, function(err, salt) {
                  Bcrypt.hash('B4c0/\/', salt, function(err, hash) {
                    var db = request.server.plugins['hapi-mongodb'].db;
                    var newSession = {
                      "session_id": hash
                    };

                    db.collection('sessions').insert(newSession, function(err, result) {
                      if (err) {
                        return reply('Internal MongoDB error', err);
                      }

                      request.session.set('hapi_twitter_session', { session_hash: hash });
                      return reply({ "message:": "Authenticated" });
                    });

                  });
                });
              } else {
                reply({ message: "Not authorized" });
              };
            });
        })
      }
    },
    {
      method: 'GET',
      path: '/authenticated',
      handler: function(request, reply) {
        Auth.authenticated(request, function(result) {
          reply(result);
        });
      }
    }
  ]);

  next();
};

exports.register.attributes = {
  name: 'static-pages-route',
  version: '0.0.1'
};
