var Joi = require('joi');

exports.register = function(server, options, next) {
  server.route([
    {
      // Retrieve all users
      method: 'GET',
      path: '/users',
      handler: function(request, reply) {
        var db = request.server.plugins['hapi-mongodb'].db;
        
        db.collection('users').find().toArray(function(err, result) {
          if (err) {
            return reply('Internal MongoDB error', err);
          }

          reply(result);
        });
      }
    },
    {
      // Retrieve one user
      method: 'GET',
      path: '/users/{username}',
      handler: function(request, reply) {
        var username = encodeURIComponent(request.params.username);

        var db = request.server.plugins['hapi-mongodb'].db;
        var ObjectId = request.server.plugins['hapi-mongodb'].ObjectID;
        
        db.collection('users').findOne({ "username": username }, function(err, result) {
            if (err) {
              return reply('Internal MongoDB error', err); 
            }

            reply(result);
        })
      }
    },
    {
      // Create a new user
      method: 'POST',
      path: '/users',
      config: {
        handler: function(request, reply) {
          var db = request.server.plugins['hapi-mongodb'].db;

          var user = {
            "username": request.payload.user.username,
            "email": request.payload.user.email
          };

          db.collection('users').insert(user, function(err, doc) {
            if (err) {
              return reply('Internal MongoDB error', err);
            } else {
              reply(doc);
            }
          });
        },
        validate: {
          payload: {
            user: {
              // Required, Limited to 20 chars
              // TODO: Make sure username and email are unique
              username: Joi.string().max(20).required(),
              email: Joi.string().required()
            }
          }
        }
      }
    }
  ]);

  next();
};

exports.register.attributes = {
  name: 'users-route',
  version: '0.0.1'
};
