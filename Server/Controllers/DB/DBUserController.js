import secure from '../../helper/encrypt';
import token from '../../helper/token';
import errorResponse from '../../helper/errorResponse';
import pool from '../../helper/db_query/queryMethod';
import queries from '../../helper/db_query/queries';

const { userQuery, msgQuery } = queries;

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
      const msgArray = ['WELCOME', `Welcome to epic mail. Experience fast, smooth and easy exchange of information with Epic Mail.
                        Get started with epicmail. Create a message or click on 'view groups' to create a new group`, id, 1, null, null];
      const newmsg = await pool.query(msgQuery.insertNewMsg, msgArray);
      const msgId = newmsg.rows[0].id;
      const InboxMsgArray = [msgId, 'WELCOME', `Welcome to epic mail. Experience fast, smooth and easy exchange of information with Epic Mail.
                              Get started with epicmail. Create a message or click on 'view groups' to create a new group`, id, 1, null, 'unread', null];
      await pool.query(msgQuery.insertNewInboxMsg, InboxMsgArray);
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
      firstname, lastname, profilePic,
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
    if (profilePic !== undefined) {
      updated = await pool
        .query(userQuery.updateProfilePic, [profilePic, id]);
    }

    return res.status(200).send({
      status: 'Successful',
      data: updated.rows[0],
    });
  }

  static async getUser(req, res) {
    const { id } = req.params;
    const { rows } = await pool.query(userQuery.getUser, [id]);
    const [user] = rows;
    if (user === undefined) {
      return errorResponse(404, 'user does not exist', res);
    }
    return res.status(200).send({
      status: 'Successful',
      data: user,
    });
  }

  static async userInfo(req, res) {
    const id = req.decoded;
    const { rows } = await pool.query(userQuery.getUser, [id]);
    const [user] = rows;
    return res.status(200).send({
      status: 'Successful',
      data: user,
    });
  }
}
export default userControllers;
