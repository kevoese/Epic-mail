import chai from 'chai';
import chaihttp from 'chai-http';
import app from '../app';
import users from './datas/testuser';
import testmessages from './datas/testmessages';

const { expect } = chai;
chai.use(chaihttp);
let userToken;

describe('Epic Test', () => {
  describe('/display welcome message', () => {
    it('display the welcome messqge', (done) => {
      chai.request(app)
        .get('/')
        .end((err, res) => {
          expect(res.body.message).to.equal('Welcome to EPic mail');
          expect(res.statusCode).to.equal(200);
          done();
        });
    });
  });

  describe('/Unused routes', () => {
    it('display an error message', (done) => {
      chai.request(app)
        .get('/vv/ll')
        .end((err, res) => {
          expect(res.body.error).to.equal('route does not exist');
          expect(res.statusCode).to.equal(400);
          done();
        });
    });
  });

  describe('POST/auth/signup', () => {
    it('should return an error on bad input', (done) => {
      chai.request(app)
        .post('/api/v2/auth/signup')
        .send(users[0])
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          done();
        });
    });

    it('should signup a user on correct input', (done) => {
      chai.request(app)
        .post('/api/v2/auth/signup')
        .send(users[1])
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.status).to.equal('Successful');
          userToken = res.body.data.Token;
          done();
        });
    });

    it('should not register an existing user', (done) => {
      chai.request(app)
        .post('/api/v2/auth/signup')
        .send(users[1])
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          done();
        });
    });
  });

  describe('POST/auth/login', () => {
    it('should not login a user with invalid format of data', (done) => {
      chai.request(app)
        .post('/api/v2/auth/login')
        .send(users[2])
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body.status).to.equal('Failure');
          done();
        });
    });
    it('should not login a user with wrong password', (done) => {
      chai.request(app)
        .post('/api/v2/auth/login')
        .send(users[3])
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body.status).to.equal('Failure');
          done();
        });
    });
    it('should not login a user with wrong email', (done) => {
      chai.request(app)
        .post('/api/v2/auth/login')
        .send(users[9])
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body.status).to.equal('Failure');
          done();
        });
    });
    it('should login a user that exists with valid format of data', (done) => {
      chai.request(app)
        .post('/api/v2/auth/login')
        .send(users[4])
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.status).to.equal('Successful');
          userToken = res.body.data.Token;
          done();
        });
    });
  });

  describe('POST/messages', () => {
    it('should not give unauthorized user access', (done) => {
      chai.request(app)
        .post('/api/v2/messages')
        .send(testmessages[0])
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body.status).to.equal('Failure');
          done();
        });
    });

    it('should submit a message with valid format of data', (done) => {
      chai.request(app)
        .post('/api/v2/messages')
        .send(testmessages[5])
        .set('token', userToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.status).to.equal('Successful');
          expect(res.body.data).to.be.an('object');
          done();
        });
    });

    it('should not submit a message with invalid data', (done) => {
      chai.request(app)
        .post('/api/v2/messages')
        .send(testmessages[4])
        .set('token', userToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body.status).to.equal('Failure');
          done();
        });
    });
  });

  describe('GET/messages', () => {
    it('should not give unauthorized user access', (done) => {
      chai.request(app)
        .get('/api/v2/messages')
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body.status).to.equal('Failure');
          done();
        });
    });

    it('should respond with all received messages', (done) => {
      chai.request(app)
        .get('/api/v2/messages')
        .set('token', userToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.status).to.equal('Successful');
          expect(res.body.data).to.be.an('array');
          done();
        });
    });
  });

  describe('GET/messages/unread', () => {
    it('should not give unauthorized user access', (done) => {
      chai.request(app)
        .get('/api/v2/messages/unread')
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body.status).to.equal('Failure');
          done();
        });
    });
    it('should respond with all unread received messages', (done) => {
      chai.request(app)
        .get('/api/v2/messages/unread')
        .set('token', userToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.status).to.equal('Successful');
          expect(res.body.data).to.be.an('array');
          done();
        });
    });
  });

  describe('GET/messages/sent', () => {
    it('should not give unauthorized user access', (done) => {
      chai.request(app)
        .get('/api/v2/messages/sent')
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body.status).to.equal('Failure');
          done();
        });
    });
    it('should respond with all sent messages', (done) => {
      chai.request(app)
        .get('/api/v2/messages/sent')
        .set('token', userToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.status).to.equal('Successful');
          expect(res.body.data).to.be.an('array');
          done();
        });
    });
  });

  describe('GET/messages/draft', () => {
    it('should not give unauthorized user access', (done) => {
      chai.request(app)
        .get('/api/v2/messages/draft')
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body.status).to.equal('Failure');
          done();
        });
    });

    it('should respond with all draft messages', (done) => {
      chai.request(app)
        .get('/api/v2/messages/draft')
        .set('token', userToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.status).to.equal('Successful');
          expect(res.body.data).to.be.an('array');
          done();
        });
    });
  });

  describe('GET/messages/:id', () => {
    it('should not give unauthorized user access', (done) => {
      chai.request(app)
        .get('/api/v2/messages/:id')
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body.status).to.equal('Failure');
          done();
        });
    });

    it('should respond with a specific message on valid message id as a sender', (done) => {
      chai.request(app)
        .get('/api/v2/messages/13')
        .set('token', userToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.status).to.equal('Successful');
          expect(res.body.data).to.be.an('object');
          done();
        });
    });

    it('should respond with a specific message on valid message id as a receiver', (done) => {
      chai.request(app)
        .get('/api/v2/messages/1')
        .set('token', userToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.status).to.equal('Successful');
          expect(res.body.data).to.be.an('object');
          done();
        });
    });

    it('should respond with an error on a message he has no access to', (done) => {
      chai.request(app)
        .get('/api/v2/messages/77')
        .set('token', userToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body.status).to.equal('Failure');
          done();
        });
    });

    it('should respond with an error on message id that does not exist', (done) => {
      chai.request(app)
        .get('/api/v2/messages/50')
        .set('token', userToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body.status).to.equal('Failure');
          done();
        });
    });

    it('should respond with an error on invalid message id', (done) => {
      chai.request(app)
        .get('/api/v2/messages/77')
        .set('token', userToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body.status).to.equal('Failure');
          done();
        });
    });
  });

  describe('DELETE/messages/:id', () => {
    it('should not give unauthorized user access', (done) => {
      chai.request(app)
        .delete('/api/v2/messages/:id')
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body.status).to.equal('Failure');
          done();
        });
    });

    it('should delete an email on valid message id', (done) => {
      chai.request(app)
        .delete('/api/v2/messages/13')
        .set('token', userToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.status).to.equal('Successful');
          done();
        });
    });

    it('should respond with an error on invalid message id', (done) => {
      chai.request(app)
        .delete('/api/v2/messages/77')
        .set('token', userToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body.status).to.equal('Failure');
          done();
        });
    });

    it('should not delete a message from the database when user is a receiver', (done) => {
      chai.request(app)
        .delete('/api/v2/messages/1')
        .set('token', userToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.status).to.equal('Successful');
          done();
        });
    });
  });

  describe('PUT/update', () => {
    it('should not give unauthorized user access', (done) => {
      chai.request(app)
        .put('/api/v2/user/update')
        .send(users[5])
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body.status).to.equal('Failure');
          done();
        });
    });

    it('should update user details on valid format of data', (done) => {
      chai.request(app)
        .put('/api/v2/user/update')
        .send(users[5])
        .set('token', userToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.status).to.equal('Successful');
          expect(res.body.data).to.be.an('object');
          done();
        });
    });

    it('should respond with an error on invalid format of data', (done) => {
      chai.request(app)
        .put('/api/v2/user/update')
        .send(users[6])
        .set('token', userToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body.status).to.equal('Failure');
          done();
        });
    });

    it('should not respond with an error if lastname is not given', (done) => {
      chai.request(app)
        .put('/api/v2/user/update')
        .send(users[7])
        .set('token', userToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.status).to.equal('Successful');
          done();
        });
    });

    it('should not respond with an error if firstname is not given', (done) => {
      chai.request(app)
        .put('/api/v2/user/update')
        .send(users[8])
        .set('token', userToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.status).to.equal('Successful');
          done();
        });
    });
  });

  // describe('POST/Groups', () => {
  //   it('should not give unauthorized user access', (done) => {
  //     chai.request(app)
  //       .post('/api/v2/groups')
  //       .send({ name: 'new group' })
  //       .end((err, res) => {
  //         expect(res.statusCode).to.equal(400);
  //         expect(res.body.status).to.equal('Failure');
  //         done();
  //       });
  //   });

  //   it('should submit a group with valid format of data', (done) => {
  //     chai.request(app)
  //       .post('/api/v2/groups')
  //       .send({ name: 'new group' })
  //       .set('token', userToken)
  //       .end((err, res) => {
  //         expect(res.statusCode).to.equal(200);
  //         expect(res.body.status).to.equal('Successful');
  //         expect(res.body.data).to.be.an('object');
  //         done();
  //       });
  //   });

  //   it('should not submit a message with invalid data', (done) => {
  //     chai.request(app)
  //       .post('/api/v2/groups')
  //       .send('12234')
  //       .set('token', userToken)
  //       .end((err, res) => {
  //         expect(res.statusCode).to.equal(400);
  //         expect(res.body.status).to.equal('Failure');
  //         done();
  //       });
  //   });
  // });
});
