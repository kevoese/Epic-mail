import chai from 'chai';
import chaihttp from 'chai-http';
import app from '../app';

chai.use(chaihttp);
const { expect } = chai;

const expectation = (res, statCode, bodytype) => {
  expect(res.statusCode).to.equal(statCode);
  expect(res.body.status).to.equal(statCode);
  if (bodytype) { expect(res.body.data).to.be.an(bodytype); }
};


const describe = {
  get: (test, endpoint, statCode, datatype = false) => {
    it(test, (done) => {
      chai.request(app)
        .get(endpoint)
        .end((err, res) => {
          expectation(res, statCode, datatype);
          done();
        });
    });
  },

  delete: (test, endpoint, statCode, datatype = false) => {
    it(test, (done) => {
      chai.request(app)
        .delete(endpoint)
        .end((err, res) => {
          expectation(res, statCode, datatype);
          done();
        });
    });
  },

  post: (test, endpoint, senddata, statCode, datatype = false) => {
    it(test, (done) => {
      chai.request(app)
        .post(endpoint)
        .send(senddata)
        .end((err, res) => {
          expectation(res, statCode, datatype);
          done();
        });
    });
  },
};


export default describe;
