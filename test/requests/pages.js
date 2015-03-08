var app = require('../../app'),
    request = require('supertest')(app);

describe('In the Pages controller', function () {
  it('should return status 200 OK when request GET /', function (done) {
    request.get('/').end(function (error, response) {
      response.status.should.eql(200);
      done();
    });
  });

  it('should redirect to / when logged out', function (done) {
    request.get('/logout').end(function (error, response) {
      response.headers.location.should.eql('/');
      done();
    });
  });

  it('should go to /contacts when POST /login with valid data', function (done) {
    var user = {'txtName': 'Test', 'txtEmail': 'test@test.app'};

    request.post('/login').send(user).end(function (error, response) {
      response.headers.location.should.eql('/contacts');
      done();
    });
  });

  it('should go to / when POST /login with invalid data', function (done) {
    var user = {'txtName': '', 'txtEmail': ''};

    request.post('/login').send(user).end(function (error, response) {
      response.headers.location.should.eql('/');
      done();
    });
  });
});