import tokenFxn from '../helper/token';
import users from '../Models/users';
import errorResponse from '../helper/errorResponse';

const Auth = (req, res, next) => {
  const { token } = req.headers;
  const { id } = tokenFxn.decodetoken(token);
  if (id === 'invalid') {
    return errorResponse(400, 'Unauthorized user', res);
  }
  req.decoded = id;
  next();
};

export default Auth;
