const KEY = 'ntalk.sid', SECRET = 'ntalk';

var express = require('express'),
    expressSession = require('express-session'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    load = require('express-load'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    mongoose = require('mongoose'),
    cookie = cookieParser(SECRET),
    store = new expressSession.MemoryStore();

app.set('views', __dirname+ '/views');
app.set('view engine', 'ejs');
app.use(cookie);
app.use(expressSession({
  'secret': SECRET,
  'name': KEY,
  'saveUninitialized': true,
  'store': store,
  'resave': true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('__method'));
app.use(express.static(__dirname+ '/public'));

io.use(function (socket, next) {
  var data = socket.request;

  cookie(data, {}, function (err) {
    var sessionID = data.signedCookies[KEY];

    store.get(sessionID, function (err, session) {
      if (err || !session) {
        return next(new Error('Access denied!'));
      } else {
        socket.handshake.session = session;
        return next();
      }
    });
  });
});

load('models')
  .then('controllers')
  .then('routes')
  .into(app);

load('sockets').into(io);

server.listen(3000, function () {
    console.log('Running on http://localhost:3000');
});

module.exports = app;