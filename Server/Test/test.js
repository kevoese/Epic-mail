import chai from 'chai';
import chaihttp from 'chai-http';
import app from '../app';
import users from './datas/testuser';
import testmessages from './datas/testmessages';
import itFxn from './describefunctions';

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
    itFxn.post('should return an error on bad input',
      '/api/v1/auth/signup',
      users[0],
      400);

    itFxn.post('should signup a user on correct input',
      '/api/v1/auth/signup',
      users[1],
      200);
  });

  describe('POST/auth/login', () => {
    itFxn.post('should not login a user with invalid format of data',
      '/api/v1/auth/login',
      users[2],
      400);

    itFxn.post('should not login a user that does not exist',
      '/api/v1/auth/login',
      users[3],
      400);

    itFxn.post('should login a user that exists with valid format of data',
      '/api/v1/auth/login',
      users[4],
      200);
  });

  describe('POST/messages', () => {
    itFxn.post('should submit a message with valid format of data',
      '/api/v1/messages',
      testmessages[0],
      200,
      'object');

    itFxn.post('should not submit a message with invalid data',
      '/api/v1/messages',
      testmessages[4],
      400);
  });

  describe('GET/messages', () => {
    itFxn.get('should respond with all received messages',
      '/api/v1/messages',
      200,
      'array');
  });

  describe('GET/messages/unread', () => {
    itFxn.get('should respond with all unread received messages',
      '/api/v1/messages/unread',
      200,
      'array');
  });

  describe('GET/messages/sent', () => {
    itFxn.get('should respond with all sent messages',
      '/api/v1/messages/sent',
      200,
      'array');
  });

  describe('GET/messages/:id', () => {
    itFxn.get('should respond with a specific message on valid message id',
      '/api/v1/messages/5',
      200,
      'object');

    itFxn.get('should respond with an error on invalid message id',
      '/api/v1/messages/tbvryr4',
      400);
  });

  describe('DELETE/messages/:id', () => {
    itFxn.delete('should delete an email on valid message id',
      '/api/v1/messages/5',
      200,
      'object');

    itFxn.delete('should respond with an error on invalid message id',
      '/api/v1/messages/tbvryr4',
      400);
  });
});
