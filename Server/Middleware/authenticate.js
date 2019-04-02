import tokenFxn from '../helper/token';
import errorResponse from '../helper/errorResponse';
import pool from '../helper/db_query/queryMethod';

const Auth = async (req, res, next) => {
  const { headers } = req;
  try {
    const { token } = headers;
    const { id } = tokenFxn.decodetoken(token);
    const result = await pool.query(`SELECT * FROM users WHERE id = ${id}`, []);
    req.decoded = result.rows[0].id;
    return next();
  } catch (err) {
    return errorResponse(401, 'Unauthorized user', res);
  }
};

export default Auth;
