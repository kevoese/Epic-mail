import chai from 'chai';
import chaihttp from 'chai-http';
import app from '../app';
import users from './datas/testuser';
import testmessages from './datas/testmessages';

const { expect } = chai;
chai.use(chaihttp);
let userAToken;
let userBToken;

describe('Epic Test', () => {
  describe('/display welcome message', () => {
    it('display the welcome message', (done) => {
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
          expect(res.body.error).to.equal('Route does not exist');
          expect(res.statusCode).to.equal(404);
          done();
        });
    });
  });

  describe('USER', () => {
    it('should return an error on bad input', (done) => {
      chai.request(app)
        .post('/api/v2/auth/signup')
        .send(users[0])
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          done();
        });
    });

    it('should signup a mailer on correct input', (done) => {
      chai.request(app)
        .post('/api/v2/auth/signup')
        .send(users[11])
        .end((err, res) => {
          expect(res.statusCode).to.equal(201);
          expect(res.body.status).to.equal('Successful');
          userAToken = res.body.data.Token;
          done();
        });
    });

    it('should signup a user A on correct input', (done) => {
      chai.request(app)
        .post('/api/v2/auth/signup')
        .send(users[1])
        .end((err, res) => {
          expect(res.statusCode).to.equal(201);
          expect(res.body.status).to.equal('Successful');
          userAToken = res.body.data.Token;
          done();
        });
    });

    it('should signup a user B on correct input', (done) => {
      chai.request(app)
        .post('/api/v2/auth/signup')
        .send(users[2])
        .end((err, res) => {
          expect(res.statusCode).to.equal(201);
          expect(res.body.status).to.equal('Successful');
          userBToken = res.body.data.Token;
          done();
        });
    });

    it('should not register an existing user', (done) => {
      chai.request(app)
        .post('/api/v2/auth/signup')
        .send(users[1])
        .end((err, res) => {
          expect(res.statusCode).to.equal(409);
          done();
        });
    });

    it('should not login a user with wrong password', (done) => {
      chai.request(app)
        .post('/api/v2/auth/login')
        .send(users[4])
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body.status).to.equal('Failure');
          done();
        });
    });

    it('should not login a user with wrong email', (done) => {
      chai.request(app)
        .post('/api/v2/auth/login')
        .send(users[3])
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body.status).to.equal('Failure');
          done();
        });
    });

    it('should login a user that exists with valid format of data', (done) => {
      chai.request(app)
        .post('/api/v2/auth/login')
        .send(users[5])
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.status).to.equal('Successful');
          done();
        });
    });

    it('should return this user info', (done) => {
      chai.request(app)
        .get('/api/v2/user')
        .set('token', userAToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.status).to.equal('Successful');
          done();
        });
    });

    it('should return a user', (done) => {
      chai.request(app)
        .get('/api/v2/user/1')
        .set('token', userAToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.status).to.equal('Successful');
          done();
        });
    });

    it('should return a user that does not exist', (done) => {
      chai.request(app)
        .get('/api/v2/user/112')
        .set('token', userAToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(404);
          expect(res.body.status).to.equal('Failure');
          done();
        });
    });
  });

  describe('MESSAGES', () => {
    it('should not give unauthorized user access', (done) => {
      chai.request(app)
        .post('/api/v2/messages')
        .send(testmessages[0])
        .end((err, res) => {
          expect(res.statusCode).to.equal(401);
          expect(res.body.status).to.equal('Failure');
          done();
        });
    });

    it('UserA should not submit a message with invalid data', (done) => {
      chai.request(app)
        .post('/api/v2/messages')
        .send(testmessages[2])
        .set('token', userAToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body.status).to.equal('Failure');
          done();
        });
    });

    it('UserA should delete a message on valid message id', (done) => {
      chai.request(app)
        .delete('/api/v2/messages/2')
        .set('token', userAToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.status).to.equal('Successful');
          done();
        });
    });

    it('UserA should respond with an empty inbox', (done) => {
      chai.request(app)
        .get('/api/v2/messages')
        .set('token', userAToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.status).to.equal('Empty');
          done();
        });
    });

    it('UserA should respond with an empty unread inbox', (done) => {
      chai.request(app)
        .get('/api/v2/messages/unread')
        .set('token', userAToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.status).to.equal('Empty');
          done();
        });
    });

    it('UserA should respond with an empty read inbox', (done) => {
      chai.request(app)
        .get('/api/v2/messages/read')
        .set('token', userAToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.status).to.equal('Empty');
          done();
        });
    });

    it('UserA should respond with an empty sent inbox', (done) => {
      chai.request(app)
        .get('/api/v2/messages/sent')
        .set('token', userAToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.status).to.equal('Empty');
          done();
        });
    });

    it('UserA should respond with an empty draft inbox', (done) => {
      chai.request(app)
        .get('/api/v2/messages/draft')
        .set('token', userAToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.status).to.equal('Empty');
          done();
        });
    });

    it('UserA should submit a sent message with valid format of data', (done) => {
      chai.request(app)
        .post('/api/v2/messages')
        .send(testmessages[0])
        .set('token', userAToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.status).to.equal('Successful');
          expect(res.body.data).to.be.an('object');
          done();
        });
    });

    it('UserA should submit a sent message with valid format of data without parent message id', (done) => {
      chai.request(app)
        .post('/api/v2/messages')
        .send(testmessages[3])
        .set('token', userAToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.status).to.equal('Successful');
          expect(res.body.data).to.be.an('object');
          done();
        });
    });

    it('UserA should submit a draft message with valid format of data', (done) => {
      chai.request(app)
        .post('/api/v2/messages')
        .send(testmessages[1])
        .set('token', userAToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.status).to.equal('Successful');
          expect(res.body.data).to.be.an('object');
          done();
        });
    });

    it('UserA should get a specific message on valid message id as a sender', (done) => {
      chai.request(app)
        .get('/api/v2/messages/4')
        .set('token', userAToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.status).to.equal('Successful');
          expect(res.body.data).to.be.an('object');
          done();
        });
    });

    it('UserA should get an error on a message he has no access to', (done) => {
      chai.request(app)
        .get('/api/v2/messages/7')
        .set('token', userAToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(404);
          expect(res.body.status).to.equal('Failure');
          done();
        });
    });

    it('UserA should get all sent messages', (done) => {
      chai.request(app)
        .get('/api/v2/messages/sent')
        .set('token', userAToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.status).to.equal('Successful');
          expect(res.body.data).to.be.an('array');
          done();
        });
    });

    it('UserA should get all draft messages', (done) => {
      chai.request(app)
        .get('/api/v2/messages/draft')
        .set('token', userAToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.status).to.equal('Successful');
          expect(res.body.data).to.be.an('array');
          done();
        });
    });

    it('UserB should get all received messages', (done) => {
      chai.request(app)
        .get('/api/v2/messages')
        .set('token', userBToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.status).to.equal('Successful');
          expect(res.body.data).to.be.an('array');
          done();
        });
    });

    it('UserB should get all unread received messages', (done) => {
      chai.request(app)
        .get('/api/v2/messages/unread')
        .set('token', userBToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.status).to.equal('Successful');
          expect(res.body.data).to.be.an('array');
          done();
        });
    });

    it('UserB should get a specific message on valid message id', (done) => {
      chai.request(app)
        .get('/api/v2/messages/4')
        .set('token', userBToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.status).to.equal('Successful');
          expect(res.body.data).to.be.an('object');
          done();
        });
    });

    it('UserB should get all read received messages', (done) => {
      chai.request(app)
        .get('/api/v2/messages/read')
        .set('token', userBToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.status).to.equal('Successful');
          expect(res.body.data).to.be.an('array');
          done();
        });
    });

    it('UserA should delete a message on valid message id', (done) => {
      chai.request(app)
        .delete('/api/v2/messages/4')
        .set('token', userAToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.status).to.equal('Successful');
          done();
        });
    });

    it('UserB should submit a sent message with valid parent message id', (done) => {
      chai.request(app)
        .post('/api/v2/messages')
        .send(testmessages[4])
        .set('token', userBToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.status).to.equal('Successful');
          expect(res.body.data).to.be.an('object');
          done();
        });
    });

    it('UserB should delete a message on valid message id', (done) => {
      chai.request(app)
        .delete('/api/v2/messages/4')
        .set('token', userBToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.status).to.equal('Successful');
          done();
        });
    });

    it('UserA should get his conversation thread on valid thread id', (done) => {
      chai.request(app)
        .get('/api/v2/messages/thread/1')
        .set('token', userAToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.status).to.equal('Successful');
          done();
        });
    });
  });

  describe('UPDATE user', () => {
    it('should not give unauthorized user access', (done) => {
      chai.request(app)
        .put('/api/v2/user/update')
        .send(users[6])
        .end((err, res) => {
          expect(res.statusCode).to.equal(401);
          expect(res.body.status).to.equal('Failure');
          done();
        });
    });

    it('should update user details on valid format of data', (done) => {
      chai.request(app)
        .put('/api/v2/user/update')
        .send(users[6])
        .set('token', userAToken)
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
        .send(users[7])
        .set('token', userAToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body.status).to.equal('Failure');
          done();
        });
    });

    it('should not respond with an error if lastname is not given', (done) => {
      chai.request(app)
        .put('/api/v2/user/update')
        .send(users[8])
        .set('token', userAToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.status).to.equal('Successful');
          done();
        });
    });
  });

  describe('Groups', () => {
    it('UserA should submit a group with valid format of data', (done) => {
      chai.request(app)
        .post('/api/v2/groups')
        .send({ name: 'new group' })
        .set('token', userAToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.status).to.equal('Successful');
          expect(res.body.data).to.be.an('object');
          done();
        });
    });

    it('UserA should get all groups he is a member of', (done) => {
      chai.request(app)
        .get('/api/v2/groups')
        .set('token', userAToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.status).to.equal('Successful');
          done();
        });
    });

    it('should edit name of group you are accessible to', (done) => {
      chai.request(app)
        .patch('/api/v2/groups/1/name')
        .set('token', userAToken)
        .send({ name: 'update group' })
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.status).to.equal('Successful');
          done();
        });
    });

    it('unauthorized member(UserB) should not edit the name of a group', (done) => {
      chai.request(app)
        .patch('/api/v2/groups/1/name')
        .send({ name: 'update group' })
        .set('token', userBToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body.status).to.equal('Failure');
          done();
        });
    });


    it('should allow a member(UserA) post a new message to a group', (done) => {
      chai.request(app)
        .post('/api/v2/groups/1/messages')
        .set('token', userAToken)
        .send({ subject: 'subject', message: 'message', status: 'sent' })
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.status).to.equal('Successful');
          done();
        });
    });

    it('should allow a member(UserA) post a new message to a group without a parent_message_id', (done) => {
      chai.request(app)
        .post('/api/v2/groups/1/messages')
        .set('token', userAToken)
        .send({
          subject: 'subject', message: 'message', status: 'sent',
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.status).to.equal('Successful');
          done();
        });
    });

    it('should allow a member(UserA) get all messages from the group', (done) => {
      chai.request(app)
        .get('/api/v2/groups/1/messages')
        .set('token', userAToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.status).to.equal('Successful');
          done();
        });
    });

    it('should not allow a member(UserB) get all messages from the group', (done) => {
      chai.request(app)
        .get('/api/v2/groups/1/messages')
        .set('token', userBToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body.status).to.equal('Failure');
          done();
        });
    });

    it('should not allow a non-member(UserB) to post a message to a group', (done) => {
      chai.request(app)
        .post('/api/v2/groups/1/messages')
        .set('token', userBToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body.status).to.equal('Failure');
          done();
        });
    });

    it('should allow an admin(UserA) add a user to a group', (done) => {
      chai.request(app)
        .post('/api/v2/groups/1/users')
        .set('token', userAToken)
        .send({ email: 'joe@epicmail.com' })
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.status).to.equal('Successful');
          done();
        });
    });

    it('should allow a member(UserB) post a new message to a group without a parent_message_id', (done) => {
      chai.request(app)
        .post('/api/v2/groups/1/messages')
        .set('token', userBToken)
        .send({
          subject: 'subject', message: 'message', status: 'sent',
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.status).to.equal('Successful');
          done();
        });
    });

    it('should allow a member(UserA) post a new message to a group with a parent_message_id', (done) => {
      chai.request(app)
        .post('/api/v2/groups/1/messages')
        .set('token', userAToken)
        .send({
          subject: 'subject', message: 'message', status: 'sent', parentMessageId: 7,
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.status).to.equal('Successful');
          done();
        });
    });


    it('should allow a member(UserA) get all members in a group', (done) => {
      chai.request(app)
        .get('/api/v2/groups/1/users')
        .set('token', userAToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.status).to.equal('Successful');
          done();
        });
    });
    it('should not allow a non member(UserA) get all members in a group', (done) => {
      chai.request(app)
        .get('/api/v2/groups/15/users')
        .set('token', userAToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(404);
          expect(res.body.status).to.equal('Failure');
          done();
        });
    });

    it('should not allow an admin(UserA) add an existing member to a group', (done) => {
      chai.request(app)
        .post('/api/v2/groups/1/users')
        .set('token', userAToken)
        .send({ email: 'joe@epicmail.com' })
        .end((err, res) => {
          expect(res.statusCode).to.equal(409);
          expect(res.body.status).to.equal('Failure');
          done();
        });
    });

    it('should not allow an admin(UserA) add an email that does not exist', (done) => {
      chai.request(app)
        .post('/api/v2/groups/1/users')
        .set('token', userAToken)
        .send({ email: 'great@epicmail.com' })
        .end((err, res) => {
          expect(res.statusCode).to.equal(404);
          expect(res.body.status).to.equal('Failure');
          done();
        });
    });

    it('UserB should get all groups he is a member of', (done) => {
      chai.request(app)
        .get('/api/v2/groups')
        .set('token', userBToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.status).to.equal('Successful');
          done();
        });
    });

    it('Member/Non-member should not delete a user from the group', (done) => {
      chai.request(app)
        .delete('/api/v2/groups/1/users/3')
        .set('token', userBToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(403);
          expect(res.body.status).to.equal('Failure');
          done();
        });
    });

    it('Only an admin(UserA) should delete a user from a group', (done) => {
      chai.request(app)
        .delete('/api/v2/groups/1/users/3')
        .set('token', userAToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.status).to.equal('Successful');
          done();
        });
    });

    it('Member/Non-member should not delete a group', (done) => {
      chai.request(app)
        .delete('/api/v2/groups/1')
        .set('token', userBToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(403);
          expect(res.body.status).to.equal('Failure');
          done();
        });
    });

    it('Only an admin(UserA) should delete a group', (done) => {
      chai.request(app)
        .delete('/api/v2/groups/1')
        .set('token', userAToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.status).to.equal('Successful');
          done();
        });
    });
  });
});
