var Joi = require('joi');
var Bcrypt = require('bcrypt');

exports.register = function(server, options, next) {
  server.route([
    {
      // Retrieve all users
      method: 'GET',
      path: '/users',
      handler: function(request, reply) {
        var db = request.server.plugins['hapi-mongodb'].db;

        db.collection('users').find().toArray(function(err, users) {
          if (err) { return reply('Internal MongoDB error', err); }

          reply(users);
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

        db.collection('users').findOne({ "username": username }, function(err, user) {
          if (err) { return reply('Internal MongoDB error', err); }

          reply(user);
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
            username: request.payload.user.username,
            email:    request.payload.user.email,
            password: request.payload.user.password
          };

          var uniqUserQuery = { $or: [{username: user.username}, {email: user.email}] };

          db.collection('users').count(uniqUserQuery, function(err, userExist){
            if (userExist) {
              return reply('Error: Username already exist', err);
            }
            
            Bcrypt.genSalt(10, function(err, salt) {
              Bcrypt.hash(user.password, salt, function(err, hash) {
                user.password = hash;

                // Store hash in your password DB.
                db.collection('users').insert(user, function(err, doc) {
                  if (err) { return reply('Internal MongoDB error', err); }

                  reply(doc);
                });
              });
            });
          });
        },
        validate: {
          payload: {
            user: {
              // Required, Limited to 20 chars
              username: Joi.string().max(20).required(),
              email:    Joi.string().email().max(50).required(),
              password: Joi.string().min(5).max(20).required()
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
