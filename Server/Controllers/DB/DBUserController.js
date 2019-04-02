import secure from '../../helper/encrypt';
import token from '../../helper/token';
import errorResponse from '../../helper/errorResponse';
import pool from '../../helper/db_query/queryMethod';
import queries from '../../helper/db_query/queries';

const { userQuery } = queries;

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

    const newData = await pool.query(userQuery.getEmail, [email]);
    if (newData.rows[0] === undefined) {
      const passwordhash = secure.encrypt(password);
      const userArray = [
        firstname, lastname, email, passwordhash,
      ];
      const user = await pool.query(userQuery.insertNewUser, userArray);
      const { id } = user.rows[0];
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
      const { rows } = await pool.query(userQuery.getEmail, [email]);
      const [user] = rows;
      if (user !== undefined) {
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
        .query(userQuery.updateFirstName, [firstname, id]);
    }
    if (lastname !== undefined) {
      updated = await pool
        .query(userQuery.updateLastName, [lastname, id]);
    }

    return res.status(200).send({
      status: 'Successful',
      data: updated.rows[0],
    });
  }
}
export default userControllers;
