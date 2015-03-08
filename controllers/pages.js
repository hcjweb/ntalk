module.exports = function (app) {
  var User = app.models.user;

  var index = function (request, response) {
    response.render('pages/index');
  };

  var login = function (request, response) {
    var query = {'email': request.body.txtEmail};

    User.findOne(query).select('name email').exec(function (error, user) {
      if (user) {
        request.session.user = user;
        response.redirect('/contacts');
      } else {
        var user = {
          'name': request.body.txtName,
          'email': request.body.txtEmail,
        };

        User.create(user, function (error, inserted_user) {
          if (error) {
            response.redirect('/');
          } else {
            request.session.user = inserted_user;
            response.redirect('/contacts');
          }
        });
      }
    });
  };

  var logout = function (request, response) {
    request.session.destroy();
    response.redirect('/');
  }

  var PageController = {
    'index': index,
    'login': login,
    'logout': logout
  }

  return PageController;
};