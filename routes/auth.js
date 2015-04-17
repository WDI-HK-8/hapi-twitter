module.exports = {};

module.exports.authenticated = function(request, callback) {
  var session = request.session.get('hapi_twitter_session');
  var db = request.server.plugins['hapi-mongodb'].db;

  if (!session) {
    return callback({
      "authenticated": false,
      "message": "Unauthorized"
    });
  }

  db.collection('sessions').findOne({ "session_id": session.session_id }, function(err, result) {
    console.log(result);
    if (result === null) {
      return callback({
        "authenticated": false,
        "message": "Unauthorized. Session exists on browser."
      });
    } else {
      return callback({
        "authenticated": true,
        "message": "Authorized. Session exists on browser."
      });
    }
  });
};

// An AJAX Example
// $.ajax({
//   type: "POST",
//   url: "http://localhost:3000/sessions",
//   data: {
//     user: {
//       username: "harry",
//       password: "harryharry"
//     }
//   },
//   dataType: 'JSON',
//   xhrFields: {
//     withCredentials: true
//   },
//   success: function(response){
//     console.log("create session / logged in", response);
//   }
// });

// $.ajax({
//   type: "GET",
//   url: "http://localhost:3000/authenticated",
//   xhrFields: {
//     withCredentials: true
//   },
//   success: function(response){
//     console.log("is it", response);
//   }
// });