import secure from '../helper/encrypt';
import token from '../helper/token';
import database from '../helper/crud';
import errorResponse from '../helper/errorResponse';


class userControllers {
  static welcome(req, res) {
    return res.status(200).json({
      message: 'Welcome to EPic mail',
    });
  }

  static signup(req, res) {
    const {
      firstname, lastname, email, password,
    } = req.body;
    if (database.findItem('users', 'email', email)) errorResponse(400, 'Email already exist', res);

    const passwordhash = secure.encrypt(password);
    const userObj = {
      firstname, lastname, email, passwordhash,
    };
    const { id } = database.add('users', userObj);
    return res.status(200).json({
      status: 200,
      data: { Token: token.createtoken({ id }) },
    });
  }

  static login(req, res) {
    const {
      email, password,
    } = req.body;
    let isUser = false;
    let id;
    const user = database.findItem('users', 'email', email);
    if (user) {
      const passwordStat = secure.compare(password, user.passwordhash);
      if (passwordStat) {
        ({ id } = user);
        isUser = true;
      }
    }


    if (isUser) {
      return res.status(200).json({
        status: 200,
        data: { Token: token.createtoken({ id }) },
      });
    }

    return errorResponse(400, 'Unauthorised user', res);
  }

  static updateProfile(req, res) {
    let {
      firstname, lastname,
    } = req.body;
    const id = req.decoded;
    if (firstname) firstname = database.updateOne('users', id, 'firstname', firstname);
    if (lastname) lastname = database.updateOne('users', id, 'lastname', lastname);

    return res.status(200).json({
      status: 200,
      data: { firstname, lastname },
    });
  }
}
export default userControllers;
