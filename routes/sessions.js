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

        // Read the payload
        var user = request.payload.user;

        db.collection('users').findOne({ "username": user.username }, function(err, userMongo) {
          if (err) { return reply('Internal MongoDB error', err); }

          if (userMongo === null) {
            return reply({ "message": "User doesn't exist" });
          }

          Bcrypt.compare(user.password, userMongo.password, function(err, result) {
            if (result) {

              // if password matches, please authenticate user and add to cookie
              function randomKeyGenerator() {
                return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
              }
   
              // Generate a random string
              var randomKey = randomKeyGenerator();

              var db = request.server.plugins['hapi-mongodb'].db;
              
              var newSession = {
                "session_id": randomKey,
                "user_id": userMongo._id
              };

              db.collection('sessions').insert(newSession, function(err, result) {
                if (err) {
                  return reply('Internal MongoDB error', err);
                }

                request.session.set('hapi_twitter_session', { 
                  "session_id": randomKey,
                  "user_id": userMongo._id
                });
                
                return reply({ "authenticated": true });
              });

            } else {
              reply({ message: "Not authorized" });
            }
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
    },
    {
      method: 'DELETE',
      path: '/sessions',
      handler: function(request, reply) {
        var session = request.session.get('hapi_twitter_session');
        var db = request.server.plugins['hapi-mongodb'].db;

        if (!session) { 
          return reply({ "message": "Already logged out" });
        }

        db.collection('sessions').remove({ "session_id": session.session_id }, function(err, writeResult) {
          if (err) { return reply('Internal MongoDB error', err); }

          reply(writeResult);
        });
      }
    }
  ]);

  next();
};

exports.register.attributes = {
  name: 'sessions-route',
  version: '0.0.1'
};
