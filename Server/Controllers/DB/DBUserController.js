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

    const newData = await CRUD.find('users', 'email', email);
    if (newData[0] === undefined) {
      const passwordhash = secure.encrypt(password);
      const userObj = {
        firstname, lastname, email, passwordhash,
      };
      const [user] = await CRUD.insert('users', '(firstname, lastname, email, passwordhash)',
        toDBArray(userObj));
      const { id } = user;
      return res.status(201).send({
        status: 'Successful',
        data: { Token: token.createtoken({ id }) },
      });
    }
    return errorResponse(409, 'Email already exist', res);
  }

  static async login(req, res) {
    const {
      email, password,
    } = req.body;
    let id;
    try {
      const [user] = await CRUD.find('users', 'email', email);
      if (user) {
        const passwordStat = secure.compare(password, user.passwordhash);
        if (passwordStat) {
          ({ id } = user);
          return res.status(200).send({
            status: 'Successful',
            data: { Token: token.createtoken({ id }) },
          });
        }
      }
    } catch (err) { return errorResponse(400, 'Bad request', res); }
    return errorResponse(400, 'Bad request', res);
  }

  static async updateProfile(req, res) {
    const {
      firstname, lastname,
    } = req.body;
    const id = req.decoded;
    let updated;

    if (firstname !== undefined) {
      updated = await pool
        .query('UPDATE users SET firstname = $1 WHERE id = $2 RETURNING firstname, lastname', [firstname, id]);
    }
    if (lastname !== undefined) {
      updated = await pool
        .query('UPDATE users SET lastname = $1 WHERE id = $2 RETURNING firstname, lastname', [lastname, id]);
    }

    return res.status(200).send({
      status: 'Successful',
      data: updated.rows[0],
    });
  }
}
export default userControllers;
