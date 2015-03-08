module.exports = function (app) {
  var autenticator = require('./../middlewares/autenticator'),
      chat = app.controllers.chat;

  app.get('/chat', autenticator, chat.index);
}