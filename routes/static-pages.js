exports.register = function(server, options, next) {
  server.route([
    {
      method: 'GET',
      path: "/public/{path*}",
      handler: {
        directory: {
          path: 'public'
        }
      }
    },
    {
      // Retrieve all users
      method: 'GET',
      path: '/',
      handler: function(request, reply) {
        reply.view('index');
      }
    },
    {
      // Retrieve all posts
      method: 'GET',
      path: '/posts',
      handler: function(request, reply) {
        reply.view('posts');
      }
    }
  ]);

  next();
};

exports.register.attributes = {
  name: 'static-pages-route',
  version: '0.0.1'
};
