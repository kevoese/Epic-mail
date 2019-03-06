import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const token = payload => jwt.sign(payload, process.env.token_key, {
  expiresIn: '1d',
});

export default token;
