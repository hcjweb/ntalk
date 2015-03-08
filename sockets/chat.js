module.exports = function (io) {
  var crypto = require('crypto'),
      redis = require('redis').createClient(),
      sockets = io.sockets;

  sockets.on('connection', function (client) {
    var session = client.handshake.session,
        user = session.user;

    redis.sadd('usersOnline', user.email, function (error) {
      redis.smembers('usersOnline', function (erro, emails) {
        emails.forEach(function (email) {
          client.emit('notify-online', email);
          client.broadcast.emit('notify-online', email);
        });
      });
    });

    client.on('join', function (room) {
      if (! room) {
        var timestamp = new Date().toString(),
            md5 = crypto.createHash('md5');

        room = md5.update(timestamp).digest('hex');
      }

      session.room = room;
      client.join(room);

      var message = '<b>' +user.name+ ':</b> joins the chat.</br>';
      sockets.in(room).emit('send-client', message);

      redis.lrange(room, 0, -2, function (error, messages) {
        messages.reverse().forEach(function (message) {
          client.emit('send-client', message);
        });
      });

      redis.lpush(room, message);
    });

    client.on('disconnect', function () {
      var room = session.room,
          message = "<strong>" +user.name+ "</strong> left the chat.<br>";

      redis.lpush(room, message);
      client.broadcast.emit('notify-offline', user.email);
      sockets.in(room).emit('send-client', message);
      redis.srem('usersOnline', user.email);
      client.leave(room);
    });

    client.on('send-server', function (data) {
      var room = session.room,
          data_message = {'email': user.email, 'room': room},
          message = "<strong>" +user.name+ "</strong>: " +data.message+ "<br>";

      redis.lpush(room, message);
      client.broadcast.emit('new-message', data_message);
      sockets.in(room).emit('send-client', message);
    });
  });
}