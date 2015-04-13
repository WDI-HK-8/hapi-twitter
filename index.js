var Hapi = require('hapi');
var server = new Hapi.Server();

server.connection({
  host: '0.0.0.0',
  port: process.env.PORT || 3000,
  routes: {
    cors: true
  }
});

var options = {
  cookieOptions: {
    password: 'password',
    isSecure: false
  }
};

server.register({
  register: require('yar'),
  options: options
}, function (err) { });

var plugins = [
  {
    register: require('./routes/tweets.js')
  },
  {
    register: require('./routes/users.js')
  },
  {
    register: require('./routes/sessions.js')
  },
  {
    register: require('hapi-mongodb'),
    options: {
      "url": process.env.MONGOLAB_URI || "mongodb://127.0.0.1:27017/hapi-twitter",
      "settings": {
        "db": {
          "native_parser": false
        }
      }
    }
  }
];

server.register(plugins, function (err) {
  if (err) {
    throw err;
  }

  server.start(function() {
    console.log('info', 'Server running at: ' + server.info.uri);
  });
});
