import CRUD from '../../helper/db_query/crud_db';
import helper from '../../helper/myFunction';
import secure from '../../helper/encrypt';
import token from '../../helper/token';
import errorResponse from '../../helper/errorResponse';
import { pool } from '../../helper/db_query/queryMethod';

const { toDBArray } = helper;

class userControllers {
  static welcome(req, res) {
    return res.status(200).send({
      message: 'Welcome to EPic mail',
    });
  }

  static async signup(req, res) {
    const {
      firstname, lastname, email, password,
    } = req.body;
    await CRUD.find('users', 'email', email);
    try {
      const passwordhash = secure.encrypt(password);
      const userObj = {
        firstname, lastname, email, passwordhash,
      };
      const [user] = await CRUD.insert('users', '(firstname, lastname, email, passwordhash)',
        toDBArray(userObj));
      const { id } = user;
      return res.status(200).send({
        status: 'Successful',
        data: { Token: token.createtoken({ id }) },
      });
    } catch (err) {
      return errorResponse(400, 'Email already exist', res);
    }
  }

}
export default userControllers;
