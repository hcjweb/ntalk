module.exports = function (app) {
  var autenticator = require('./../middlewares/autenticator'),
      contacts = app.controllers.contacts;

  app.get('/contacts', autenticator, contacts.index);
  app.get('/contacts/:id', autenticator, contacts.show);
  app.post('/contacts', autenticator, contacts.create);
  app.get('/contacts/:id/edit', autenticator, contacts.edit);
  app.put('/contacts/:id', autenticator, contacts.update);
  app.delete('/contacts/:id', autenticator, contacts.delete);
}