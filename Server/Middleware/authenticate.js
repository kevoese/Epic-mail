import tokenFxn from '../helper/token';
import database from '../helper/crud';
import errorResponse from '../helper/errorResponse';

const users = database.getStorage('users');

const Auth = (req, res, next) => {
  const { token } = req.headers;
  const { id } = tokenFxn.decodetoken(token);
  const isUser = users.find(user => user.id === id);
  if (isUser === undefined) {
    return errorResponse(400, 'Unauthorized user', res);
  }
  req.decoded = id;
  next();
};

export default Auth;
