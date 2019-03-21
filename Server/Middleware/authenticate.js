import tokenFxn from '../helper/token';
import errorResponse from '../helper/errorResponse';
import CRUD from '../helper/db_query/crud_db';


const Auth = async (req, res, next) => {
  try {
    const { token } = req.headers;
    const { id } = tokenFxn.decodetoken(token);
    const result = await CRUD.find('users', 'id', id);
    if (result) {
      req.decoded = id;
      next();
    } else return errorResponse(401, 'Unauthorized user', res);
  } catch (err) {
    return errorResponse(401, 'Unauthorized user', res);
  }
};

export default Auth;
