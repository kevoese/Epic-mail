/* eslint-disable camelcase */
import secure from '../../helper/encrypt';
import token from '../../helper/token';
import errorResponse from '../../helper/errorResponse';
import pool from '../../helper/db_query/queryMethod';
import queries from '../../helper/db_query/queries';
import randomPasswordgen from '../../helper/randomPassword';
import { resetMailer } from '../../helper/nodeMailer';

const { userQuery, msgQuery } = queries;

const userConfirm = async (details) => {
  const { email, password } = details;
  const { rows } = await pool.query(userQuery.getEmail, [email]);
  const [user] = rows;
  if (user !== undefined) {
    const passwordStat = secure.compare(password, user.passwordhash);
    if (passwordStat) {
      const {
        id, firstname, lastname, email, alternativeEmail, profile_pic, mobile_no,
      } = user;
      return {
        id,
        firstname,
        lastname,
        email,
        alternativeEmail,
        profile_pic,
        mobile_no,
      };
    }
  }
  return false;
};

class userControllers {
  static welcome(req, res) {
    return res.status(200).send({
      message: 'Welcome to Epic Mail',
    });
  }

  static async signup(req, res) {
    const {
      firstname, lastname, email, password, alternativeEmail,
    } = req.body;

    const newData = await pool.query(userQuery.getEmail, [email]);
    if (newData.rows[0] === undefined) {
      const passwordhash = secure.encrypt(password);
      const userArray = [firstname, lastname, email, passwordhash, alternativeEmail];
      const user = await pool.query(userQuery.insertNewUser, userArray);
      const { id, profile_pic } = user.rows[0];
      const msgArray = ['WELCOME', userQuery.welcomeMsg, id, 1, null, 'sent', null];
      const newmsg = await pool.query(msgQuery.insertNewMsg, msgArray);
      const msgId = newmsg.rows[0].id;
      const InboxMsgArray = [msgId, 'WELCOME', userQuery.welcomeMsg, id, 1, null, 'unread', null];
      await pool.query(msgQuery.insertNewInboxMsg, InboxMsgArray);
      await resetMailer(
        alternativeEmail,
        'EPIC MAIL',
        'Welcome to epic mail. We hope you enjoy our services.',
      );
      return res.status(201).send({
        status: 'Successful',
        data: {
          Token: token.createtoken({ id }),
          user: {
            id,
            firstname,
            lastname,
            email,
            alternativeEmail,
            profile_pic,
          },
        },
      });
    }
    return errorResponse(409, 'Email already exist', res);
  }

  static async login(req, res) {
    const user = await userConfirm(req.body);
    const { id } = user;
    if (id) {
      return res.status(200).send({
        status: 'Successful',
        data: {
          Token: token.createtoken({ id }),
          user,
        },
      });
    }
    return errorResponse(400, 'Invalid email or password', res);
  }

  static async updateProfile(req, res) {
    const {
      firstname, lastname, profilePic, mobileNo, alternativeEmail,
    } = req.body;
    const id = req.decoded;
    let updated;

    if (firstname !== undefined) {
      updated = await pool.query(userQuery.updateFirstName, [firstname, id]);
    }
    if (lastname !== undefined) {
      updated = await pool.query(userQuery.updateLastName, [lastname, id]);
    }
    if (profilePic !== undefined) {
      updated = await pool.query(userQuery.updateProfilePic, [profilePic, id]);
    }
    if (mobileNo !== undefined) {
      updated = await pool.query(userQuery.updateMobileNo, [mobileNo, id]);
    }
    if (alternativeEmail !== undefined) {
      updated = await pool.query(userQuery.updateAltEmail, [alternativeEmail, id]);
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

  static async resetUserInfo(req, res) {
    const { email } = req.params;
    const { rows } = await pool.query(userQuery.getResetUser, [email]);
    const [user] = rows;
    if (user === undefined) {
      return errorResponse(404, 'user does not exist', res);
    }
    return res.status(200).send({
      status: 'Successful',
      data: user,
    });
  }

  static async resetMethod(req, res) {
    const { id } = req.params;
    const newPassword = randomPasswordgen();
    const { rows } = await pool.query(userQuery.getUser, [id]);
    if (!rows[0]) return errorResponse(400, 'Bad request', res);
    const [user] = rows;
    const { alt_email } = user;
    const emailStat = await resetMailer(
      alt_email,
      'Password Reset',
      `This is your reset Password: ${newPassword}`,
    );
    const passwordhash = secure.encrypt(newPassword);
    if (emailStat) {
      await pool.query(userQuery.updatePassword, [passwordhash, id]);
      return res.status(200).send({
        status: 'Successful',
        data: 'Operation was successful',
      });
    }
    return errorResponse(500, 'Something went wrong', res);
  }

  static async updatePassword(req, res) {
    const { email, newPassword, oldPassword } = req.body;
    const password = oldPassword;
    const user = await userConfirm({ email, password });
    const { id } = user;
    if (!id) return errorResponse(400, 'Bad request', res);
    const passwordhash = secure.encrypt(newPassword);
    await pool.query(userQuery.updatePassword, [passwordhash, id]);
    return res.status(200).send({
      status: 'Successful',
      data: { Token: token.createtoken({ id }), user },
    });
  }
}
export default userControllers;
