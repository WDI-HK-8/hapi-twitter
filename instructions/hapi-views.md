## STEPS BY STEP GUIDE
#### Hapi Views

###### Install Path + Handlebar
- `npm install --save path`
- `npm install --save handlebars`

###### Setting up Path + Handlebar

```js
// index.js

...
var Path = require('path');
...

var plugins = [
...
{ register: require('./routes/static-pages.js') },
...
];

server.views({
  engines: {
    html: require('handlebars')
  },
  path: Path.join(__dirname, 'templates')
});

```

###### Setting up view endpoint

```js
// routes/static-pages.js

exports.register = function(server, options, next) {
  server.route([
    {
      // Retrieve all users
      method: 'GET',
      path: '/',
      handler: function(request, reply) {
        reply.view('index');
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

###### Setting up view template

```html
<!-- templates/index.html -->

<!DOCTYPE html>
<html>
<head>
  <title>Twitter using Hapi.js</title>

  <script type="text/javascript" src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
  <script type="text/javascript" src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>

  <link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
</head>
<body>
  <div class="container">
    <div class="row">
      <h1>Hello World!</h1>
    </div>
  </div>
</body>
</html>
```

###### Setting up JavaScript with view

```js
// routes/static-pages.js

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
    
    ...
  
  ]);

  next();
};

...
```

```js
// public/index.js

$(document).ready(function(){

});
```

```html
<!-- templates/index.html -->

<!DOCTYPE html>
<html>
<head>
  ...

  <script type="text/javascript" src="public/index.js"></script>

  ...
</head>
<body>

  ...

</body>
</html>
```