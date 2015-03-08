module.exports = function (app) {
  var pages = app.controllers.pages;

  app.get('/', pages.index);
  app.post('/login', pages.login);
  app.get('/logout', pages.logout);
};