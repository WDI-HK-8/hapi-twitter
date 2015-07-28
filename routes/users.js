// Defining the plugin
exports.register = function(server, options, next){
  // Define routes
  server.route([
    // I am **receiving** a POST request
    {
      method: 'POST',
      path: '/users',
      handler: function(request, reply){
        var db = request.server.plugins['hapi-mongodb'].db;

        var user = request.payload.user;
        // user = {
        //   name: ...,
        //   email: ...
        //   ...
        // }

        db.collection('users').insert(user, function(err, writeResult){
          reply(writeResult);
        });
      }
    }
  ]);

  next(); // <-- DO NOT FORGET THIS
};

// Defining the description of the plugin
exports.register.attributes = {
  name: 'users-routes',
  version: '0.0.1'
};