import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const token = {
  createtoken: payload => jwt.sign(payload, process.env.token_key, {
    expiresIn: '1d',
  }),

  decodetoken: tokenStr => jwt.verify(tokenStr, process.env.token_key, (err, data) => {
    if (err) throw new Error('invalid token');
    return data;
  }),

};

export default token;
