module.exports = function (app) {
  var User = app.models.user;

  var index = function (request, response) {
    var _id = request.session.user._id;

    User.findById(_id, function (error, user) {
      var contacts = user.contacts,
          params = {'user': user, 'contacts': contacts};

      response.render('contacts/index', params);
    });
  };

  var show = function (request, response) {
    var _id = request.session.user._id;

    User.findById(_id, function (error, user) {
      var contactId = request.params.id,
          contact = user.contacts.id(contactId),
          params = {'contact': contact};

      response.render('contacts/show', params);
    });
  }

  var create = function (request,  response) {
    var _id = request.session.user._id;

    User.findById(_id, function (error, user) {
      var contact = {
            'name': request.body.txtName,
            'email': request.body.txtEmail,
          },
          contacts = user.contacts;

      contacts.push(contact);

      user.save(function () {
        response.redirect('/contacts');
      });
    });
  };

  var edit = function (request, response) {
    var _id = request.session.user._id;

    User.findById(_id, function (error, user) {
      var contactId = request.params.id,
          contact = user.contacts.id(contactId),
          params = {'contact': contact};

      response.render('contacts/edit', params);
    });
  }

  var update = function (request, response) {
    var _id = request.session.user._id;

    User.findById(_id, function (error, user) {
      var contactId = request.params.id,
          contact = user.contacts.id(contactId);

      contact.name = request.body.txtName;
      contact.email = request.body.txtEmail;

      user.save(function () {
        response.redirect('/contacts');
      });
    });
  }

  var destroy = function (request, response) {
    var _id = request.session.user._id;

    User.findById(_id, function (error, user) {
      var contactId = request.params.id,
          contacts = user.contacts.id(contactId).remove();

      user.save(function () {
        response.redirect('/contacts');
      });
    });
  }

  var ContactsController = {
    'index': index,
    'show': show,
    'create': create,
    'edit': edit,
    'update': update,
    'delete': destroy
  };

  return ContactsController;
}