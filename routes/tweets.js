var Joi = require('joi');

exports.register = function(server, options, next) {
  server.route([
    {
      // Retrieve all tweets
      method: 'GET',
      path: '/tweets',
      handler: function(request, reply) {
        var db = request.server.plugins['hapi-mongodb'].db;

        db.collection('tweets').find().toArray(function(err, tweets) {
          if (err) { return reply('Internal MongoDB error', err); }

          reply(tweets);
        });
      }
    },
    {
      // Retrieve one tweet
      method: 'GET',
      path: '/tweets/{id}',
      handler: function(request, reply) {
        var tweet_id = encodeURIComponent(request.params.id);

        var db = request.server.plugins['hapi-mongodb'].db;
        var ObjectId = request.server.plugins['hapi-mongodb'].ObjectID;

        db.collection('tweets').findOne({ "_id": ObjectId(tweet_id)}, function(err, tweet) {
          if (err) { return reply('Internal MongoDB error', err); }

          reply(tweet);
        })
      }
    },
    {
      // Create a new tweet
      method: 'POST',
      path: '/tweets',
      config: {
        handler: function(request, reply) {
          var db = request.server.plugins['hapi-mongodb'].db;

          var tweet = { "message": request.payload.tweet.message };

          db.collection('tweets').insert(tweet, function(err, writeResult) {
            if (err) { return reply('Internal MongoDB error', err); }

            reply(writeResult);
          });
        },
        validate: {
          payload: {
            tweet: {
              // Required, Limited to 140 chars
              message: Joi.string().max(140).required()
            }
          }
        }
      }
    },
    {
      // Delete one tweet
      method: 'DELETE',
      path: '/tweets/{id}',
      handler: function(request, reply) {
        var tweet_id = encodeURIComponent(request.params.id);

        var db = request.server.plugins['hapi-mongodb'].db;
        var ObjectId = request.server.plugins['hapi-mongodb'].ObjectID;

        db.collection('tweets').remove({ "_id": ObjectId(tweet_id) }, function(err, writeResult) {
            if (err) { return reply('Internal MongoDB error', err); }

            reply(writeResult);
        });
      }
    }
  ]);

  next();
};

exports.register.attributes = {
  name: 'tweets-route',
  version: '0.0.1'
};
