const chai = require('chai');
const chaiHTTP = require('chai-http');
const app = require('../src/app');
chai.use(chaiHTTP);
require('chai/register-should');

//USER TESTS
const newUser = {
    name: 'Adesanya Adetomiwa',
    email: 'pauloooo@gmail.com',
    designation: 'blah blah',
    is_admin: 'true',
    is_premium: 'true',
    password: 'bluwaters'
}
const badUser = {
    email: 'wizard@gmail.com',
    designation: 'blah blah',
    is_admin: 'true',
    is_premium: 'true',
    password: 'bluwaters'
}


//Register User
describe('it should register new user', () => {
    it('should create new user', (done) => {
        chai
          .request(app)
          .post('/api/v1/user/register')
          .send(newUser)
          .end((err, res) => {
              res.should.have.property('status', 200);
              res.body.should.be.a('object');
              res.body.data.should.have.property('id');
              res.body.data.should.have.property('name');
              res.body.data.should.have.property('email');
              res.body.data.should.have.property('admin');
              res.body.data.should.have.property('premium');
           done();
          })
    });
    it('should not register a user twice', (done) => {
        chai
          .request(app)
          .post('/api/v1/user/register')
          .send(newUser)
          .end((err, res) => {
              res.should.have.property('status', 409);
           done();
          })
    });
    it('should not register without complete information', (done) => {
        chai
          .request(app)
          .post('/api/v1/user/register')
          .send(badUser)
          .end((err, res) => {
              res.should.have.property('status', 400);
          done();  
          });
    });
});

// Login User 
describe('Login User', () => {
    it('should login user', (done) => {
        const loginUser = {
            email: newUser.email,
            password: newUser.password
        }
        chai
          .request(app)
          .post('/api/v1/user/login')
          .send(loginUser)
          .end((err, res) => {
              res.should.have.property('status', 200);
              res.body.data.should.have.property('id');
              res.body.data.should.have.property('email');
              res.body.data.should.have.property('admin');
              res.body.data.should.have.property('premium');
            done();
          });
    });
    it('should not login a user with wrong password', (done) => {
        const wrongPassword = {
            email: newUser.email,
            password: 'wrong'
        }
        chai
          .request(app)
          .post('/api/v1/user/login')
          .send(wrongPassword)
          .end((err, res) => {
              res.should.have.property('status', 401);
            done();
        });

    });
    it('should not login a user that has not signed up', (done) => {
        const notRegistered = {
            email: 'sample@yahoo.com',
            password: 'password'
        }
        chai
          .request(app)
          .post('/api/v1/user/login')
          .send(notRegistered)
          .end((err, res) => {
              res.should.have.property('status', 404);
            done();
          });
    });
});