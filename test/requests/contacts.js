var app = require('../../app'),
    request = require('supertest')(app);

describe('In Contacts controller', function () {
  describe('the authorized user', function () {
    var user = {'txtName': 'Test', 'txtEmail': 'test@test.app'},
        contact = {'txtName': 'Contact Test', 'txtEmail': 'contact.test@test.app'},
        cookie = {};

    beforeEach(function (done) {
      request.post('/login').send(user).end(function (error, response) {
        cookie = response.headers['set-cookie'];
        done();
      });
    });

    it('should return status 200 Ok when request GET /contacts', function (done) {
      var req = request.get('/contacts');

      req.cookies = cookie;
      req.end(function (error, response) {
        response.status.should.eql(200);
        done();
      });
    });

    it('should redirect to /contacts when request POST /contacts', function (done) {
      var req = request.post('/contacts');

      req.cookies = cookie;
      req.send(contact).end(function (error, response) {
        response.headers.location.should.eql('/contacts');
        done();
      });
    });
  });

  describe('the unauthorized user', function () {
    describe('should be redirect to /', function () {
      it('when request GET /contacts', function (done) {
        request.get('/contacts').end(function (error, response) {
          response.headers.location.should.eql('/');
          done();
        });
      });

      it('when resquest GET /contacts/1', function (done) {
        request.get('/contacts/1').end(function (error, response) {
          response.headers.location.should.eql('/');
          done();
        });
      });

      it('when request GET /contacts/1/edit', function (done) {
        request.get('/contacts/1/edit').end(function (error, response) {
          response.headers.location.should.eql('/');
          done();
        });
      });

      it('when request POST /contacts', function (done) {
        request.post('/contacts').end(function (error, response) {
          response.headers.location.should.eql('/');
          done();
        });
      });

      it('when request DELETE /contacts/1', function (done) {
        request.del('/contacts/1').end(function (error, response) {
          response.headers.location.should.eql('/');
          done();
        });
      });

      it('when request PUT /contacts/1', function (done) {
        request.put('/contacts/1').end(function (error, response) {
          response.headers.location.should.eql('/');
          done();
        });
      });
    });
  });
});