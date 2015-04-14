## STEPS BY STEP GUIDE
#### Sessions

```
$ npm install yar --save
```

#### STEP 1: Create a new session (logging in)

Add to `plugins`

```js
{ register: require('./routes/sessions.js') }
```

#### STEP 2: Include jar for reading and creating Cookies in the browser

```js
// index.js

// include Yar
var yarOptions = {
  cookieOptions: {
    password: process.env.COOKIE_PASSWORD || 'password',
    isSecure: false
  }
};

server.register({
  register: require('yar'),
  options: yarOptions
}, function (err) { });

```

#### STEP 3: Include necessary dependencies
```js
// routes/sessions.js

var Joi = require('joi');
var Bcrypt = require('bcrypt');
```


#### STEP 4: Signing in user v1 (check if user exists)
```js
// routes/sessions.js

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

            if (userMongo === null) {
              return reply({ "message": "User doesn't exist" });
            }

            Bcrypt.compare(user.password, userMongo.password, function(err, result) {
              // If password matches, please authenticate user and add to cookie
            });
        })
      }
    }
  ]);

  next();
};

exports.register.attributes = {
  name: 'static-pages-route',
  version: '0.0.1'
};

```

#### STEP 5: Signing in user v2 (create a Session in the database)
```js
Bcrypt.compare(data, encrypted, callback)
```

- `data` - [REQUIRED] - data to compare.
- encrypted - [REQUIRED] - data to be compared to.
- `callback` - [REQUIRED] - a callback to be fired once the data has been compared.
  -  `error` - First parameter to the callback detailing any errors.
  - `result` - Second parameter to the callback providing whether the data and encrypted forms match [true | false].


```js
// If password matches, please authenticate user and add to cookie
if (result) {

  function randomKeyGenerator() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
  }
   
  // Generate a random key
  var randomkey = (randomKeyGenerator() + randomKeyGenerator() + "-" + randomKeyGenerator() + "-4" + randomKeyGenerator().substr(0,3) + "-" + randomKeyGenerator() + "-" + randomKeyGenerator() + randomKeyGenerator() + randomKeyGenerator()).toLowerCase();

  // Hash the random key with salt using Bcrypt
  Bcrypt.genSalt(10, function(err, salt) {
    Bcrypt.hash(randomkey, salt, function(err, hash) {
      var db = request.server.plugins['hapi-mongodb'].db;
      var newSession = {
        "session_id": hash,
        "user_id": userMongo._id
      };

      // Create a Session in the database
      db.collection('sessions').insert(newSession, function(err, result) {
        if (err) {
          return reply('Internal MongoDB error', err);
        }

        // Store the Session information in the browser Cookie

        return reply({ "message:": "Authenticated" });
      });

    });
  });
} else {
  reply({ message: "Not authorized" });
};
```


#### STEP 6: Signing in user v3 (store a Session information into a Cookie in the browser)
```js
// Store the Session information in the browser Cookie
request.session.set('hapi_twitter_session', { 
  "session_hash": hash,
  "user_id": userMongo._id
});
```


#### STEP 7: Signing out user / Deleting a Session
```js
{
  method: 'DELETE',
  path: '/sessions',
  handler: function(request, reply) {
    var session = request.session.get('hapi_twitter_session');
    var db = request.server.plugins['hapi-mongodb'].db;

    if (!session) { 
      return reply({ "message": "Already logged out" });
    }

    db.collection('sessions').remove({ "session_id": session.session_hash }, function(err, writeResult) {
      if (err) { return reply('Internal MongoDB error', err); }

      reply(writeResult);
    });
  }
}
```


#### STEP 8: Check if the user is signed in or not

```js
// routes/sessions.js

var Auth = require('./auth');

.
.
.

{
  method: 'GET',
  path: '/authenticated',
  handler: function(request, reply) {
    Auth.authenticated(request, function(result) {
      reply(result);
    });
  }
}
```

```js
// routes/auth.js
module.exports = {};

module.exports.authenticated = function(request, callback) {
  var session = request.session.get('hapi_twitter_session');
  var db = request.server.plugins['hapi-mongodb'].db;

  if (!session) {
    return callback({ "authenticated": false, "message": "Unauthorized" });
  }

  db.collection('sessions').findOne({ "session_id": session.session_hash }, function(err, result) {
    if (result === null) {
      return callback({ "authenticated": false, "message": "Unauthorized" });
    } else {
      return callback({ "authenticated": true, "message": "Authorized "});
    }
  });
};
```

