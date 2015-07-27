## STEPS BY STEP GUIDE
#### Getting Started

#### Components
- https://www.npmjs.com/package/bcrypt-nodejs
- https://github.com/hapijs/joi
- https://github.com/hapijs/yar

#### STEP 0: Robomongo
- Shell-centric cross-platform MongoDB management tool
- Download and install http://robomongo.org/
- Configurations
  + Name: Local MongoDB
  + Address: 127.0.0.1
  + Port: 27017

#### STEP 1: Install Hapi.js
```
$ npm init
$ mkdir hapi-twitter
$ cd hapi-twitter
$ npm install hapi --save
$ npm install hapi-mongodb --save
$ npm install bcrypt --save
$ npm install joi --save
```

#### STEP 2: Start Node server and Mongo server
```
$ watchy -w . -- node .

watchy will restart the server for you every time you change your file. If you haven't installed watchy, do the following:
$ npm install -g watchy
```

#### STEP 3: index.js
```js
// index.js

// Require hapi
var Hapi = require('hapi');
var server = new Hapi.Server();

// Configure server connections
server.connection({
  host: '0.0.0.0',
  port: process.env.PORT || 3000, // What is process.env.PORT? It's an environment variable prepared by Heroku Deployment
  routes: {
    cors: {
      headers: ["Access-Control-Allow-Credentials"],
      credentials: true
    } // Cross-origin resource sharing (CORS) is a mechanism that enables many resources (e.g. fonts, JavaScript, etc.) on a web page to be requested from another domain outside the domain from which the resource originated.
  }
});

// Require MongoDB
var plugins = [
  { register: require('hapi-mongodb'),
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
// Start server if there's no error in code
server.register(plugins, function (err) {
  if (err) {
    throw err;
  }

  server.start(function() {
    console.log('info', 'Server running at: ' + server.info.uri);
  });
});
```
