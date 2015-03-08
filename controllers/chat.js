module.exports = function (app) {
  var index = function (request, response) {
    var params = {'room': request.query.room};
    response.render('chat/index', params);
  };

  var ChatController = {
    'index': index
  };

  return ChatController;
};