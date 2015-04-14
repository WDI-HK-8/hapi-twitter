## STEPS BY STEP GUIDE
#### User

#### STEP 1: List all users
```js
// routes/users.js

var Joi = require('joi'); // What do JOI do? Object schema validation
var Bcrypt = require('bcrypt'); // What is Bcrypt? Encryption / Hashing function

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
    }
  ]);

  next();
};

exports.register.attributes = {
  name: 'users-route',
  version: '0.0.1'
};

```

#### STEP 2: Create a new user v1 (basic)
```js
{
  // Create a new user
  method: 'POST',
  path: '/users',
  config: {
    handler: function(request, reply) {
      var db = request.server.plugins['hapi-mongodb'].db;

      // Get user input parameters (username, email, password)
      var user = {
        username: request.payload.user.username,
        email:    request.payload.user.email,
        password: request.payload.user.password
      };

      db.collection('users').insert(user, function(err, doc) {
        if (err) { return reply('Internal MongoDB error', err); }

        reply(doc);
      });
    }
  }
}
```

#### STEP 3: Create a new user v2 (validate for unique users)
```js
{
  // Create a new user
  method: 'POST',
  path: '/users',
  config: {
    handler: function(request, reply) {
      var db = request.server.plugins['hapi-mongodb'].db;

      // Get user input parameters (username, email, password)
      var user = {
        username: request.payload.user.username,
        email:    request.payload.user.email,
        password: request.payload.user.password
      };

      // Check if there is an existing user with the same username or the same email address
      var uniqUserQuery = { $or: [{username: user.username}, {email: user.email}] };

      db.collection('users').count(uniqUserQuery, function(err, userExist){
        if (userExist) {
          return reply('Error: Username already exist', err);
        }
        
        // Now, add the new user into the database
      });
    }
  }
}
```

#### STEP 4: Create a new user v3 (validate for unique users + encrypting password)

###### What is salt?
- In cryptography, a salt is random data that is used as an additional input to a one-way function that hashes a password or passphrase.[1] The primary function of salts is to defend against dictionary attacks versus a list of password hashes and against pre-computed rainbow table attacks.

###### What is rainbow table attack?
- A rainbow table is a precomputed table for reversing cryptographic hash functions, usually for cracking password hashes.

###### Generate a random salt:
```js
Bcrypt.genSalt(rounds, callback)
```
- Stored in the database, a bcrypt "hash" might look something like this:
- `2a` identifies the bcrypt algorithm version that was used.
- `10` is the cost factor; 2^10 iterations of the key derivation function are used
- `vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa` is the salt and the cipher text, concatenated and encoded in a modified Base-64. The first 22 characters decode to a 16-byte value for the salt. The remaining characters are cipher text to be compared for authentication.
- `$` are used as delimiters for the header section of the hash.

###### Hashing a phrase:
```js
Bcrypt.hash(data, salt, callback)
```
- `data` - [REQUIRED] - the data to be encrypted.
- `salt` - [REQUIRED] - the salt to be used to hash the password.
- `callback` - [REQUIRED] - a callback to be fired once the data has been encrypted.
  - `error` - First parameter to the callback detailing any errors.
  - `result` - Second parameter to the callback providing the encrypted form.

###### What is Bcrypt?
- bcrypt is a key derivation function for passwords designed by Niels Provos and David Mazières, based on the Blowfish cipher, and presented at USENIX in 1999.
- http://en.wikipedia.org/wiki/Bcrypt

```js
// Now, add the new user into the database
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
```

#### STEP 5: Create a new user v3 (validate for unique users + encrypting password + input validators)
```js
{
  // Create a new user
  method: 'POST',
  path: '/users',
  config: {
    handler: function(request, reply) {
      // previous codes
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
```

#### STEP 6: Retrieve one user
```js
{
  // Retrieve one user
  method: 'GET',
  path: '/users/{username}',
  handler: function(request, reply) {
    // What is encodeURIComponent()? Visit http://stackoverflow.com/questions/75980/best-practice-escape-or-encodeuri-encodeuricomponent
    var username = encodeURIComponent(request.params.username);
    var db = request.server.plugins['hapi-mongodb'].db;

    db.collection('users').findOne({ "username": username }, function(err, user) {
      if (err) { return reply('Internal MongoDB error', err); }

      reply(user);
    })
  }
}
```