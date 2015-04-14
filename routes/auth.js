module.exports = {};

module.exports.authenticated = function(request, callback) {
  var session = request.session.get('hapi_twitter_session');
  var db = request.server.plugins['hapi-mongodb'].db;

  if (!session) {
    // return reply("no");
    return callback(false);
  }

  db.collection('sessions').findOne({ "session_id": session.session_hash }, function(err, result) {
    return callback(!err);
  });
};