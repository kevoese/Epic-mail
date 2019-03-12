import chai from 'chai';
import chaihttp from 'chai-http';
import app from '../app';
import users from './datas/testuser';
import testmessages from './datas/testmessages';
import messages from '../Models/messages';

const { expect } = chai;
chai.use(chaihttp);

describe('Epic Test', () => {
  describe('/display welcome message', () => {
    it('display the welcome messqge', (done) => {
      chai.request(app)
        .get('/api/v1/')
        .end((err, res) => {
          expect(res.body.message).to.equal('Welcome to EPic mail');
          expect(res.statusCode).to.equal(200);
          done();
        });
    });
  });

  describe('POST/auth/signup', () => {
    it('should return an error on bad input', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send(users[0])
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          done();
        });
    });

    it('should signup a user on correct input', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send(users[1])
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.status).to.equal(200);
          done();
        });
    });
  });

  describe('POST/auth/login', () => {
    it('should not login a user with invalid format of data', (done) => {
      chai.request(app)
        .post('/api/v1/auth/login')
        .send(users[2])
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body.status).to.equal(400);
          done();
        });
    });
    it('should not login a user that does not exist', (done) => {
      chai.request(app)
        .post('/api/v1/auth/login')
        .send(users[3])
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body.status).to.equal(400);
          done();
        });
    });
    it('should login a user that exists with valid format of data', (done) => {
      chai.request(app)
        .post('/api/v1/auth/login')
        .send(users[4])
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.status).to.equal(200);
          done();
        });
    });
  });

  describe('POST/messages', () => {
    it('should submit a message with valid format of data', (done) => {
      chai.request(app)
        .post('/api/v1/messages')
        .send(testmessages[0])
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.status).to.equal(200);
          expect(res.body.data).to.be.an('object');
          done();
        });
    });

    it('should not submit a message with invalid data', (done) => {
      chai.request(app)
        .post('/api/v1/messages')
        .send(testmessages[4])
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body.status).to.equal(400);
          done();
        });
    });
  });

  describe('GET/messages', () => {
    it('should respond with all received messages', (done) => {
      chai.request(app)
        .get('/api/v1/messages')
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.status).to.equal(200);
          expect(res.body.data).to.be.an('array');
          done();
        });
    });
  });

  describe('GET/messages/unread', () => {
    it('should respond with all unread received messages', (done) => {
      chai.request(app)
        .get('/api/v1/messages/unread')
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.status).to.equal(200);
          expect(res.body.data).to.be.an('array');
          done();
        });
    });
  });

  describe('GET/messages/sent', () => {
    it('should respond with all sent messages', (done) => {
      chai.request(app)
        .get('/api/v1/messages/sent')
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.status).to.equal(200);
          expect(res.body.data).to.be.an('array');
          done();
        });
    });
  });

  describe('GET/messages/:id', () => {
    it('should respond with a specific message on valid message id', (done) => {
      chai.request(app)
        .get('/api/v1/messages/5')
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.status).to.equal(200);
          expect(res.body.data).to.be.an('object');
          expect(res.body.data.id).to.equal(messages[4].id);
          done();
        });
    });

    it('should respond with an error on invalid message id', (done) => {
      chai.request(app)
        .get('/api/v1/messages/tbvryr4')
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body.status).to.equal(400);
          done();
        });
    });
  });

  describe('DELETE/messages/:id', () => {
    it('should delete an email on valid message id', (done) => {
      chai.request(app)
        .delete('/api/v1/messages/5')
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.status).to.equal(200);
          expect(res.body.data).to.be.an('object');
          done();
        });
    });

    it('should respond with an error on invalid message id', (done) => {
      chai.request(app)
        .delete('/api/v1/messages/tbvryr4')
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body.status).to.equal(400);
          done();
        });
    });
  });
});
