/* eslint-disable camelcase */
import CRUD from '../../helper/db_query/crud_db';
import helper from '../../helper/myFunction';
import errorResponse from '../../helper/errorResponse';
import { pool } from '../../helper/db_query/queryMethod';

const { toDBArray } = helper;

class EpicMessage {
  static async specificMessage(req, res) {
    const messageId = req.params.id;
    const userId = req.decoded;
    const { rows } = await pool
      .query(`SELECT * FROM messages WHERE (id = ${messageId}) AND (receiver_id = ${userId} OR sender_id = ${userId}) `, []);
    const read = { userId, messageId };
    let message;
    if (rows[0] !== undefined) {
      [message] = rows;
      const itExist = await pool.query(`SELECT * FROM read WHERE (user_id = ${userId} AND message_id = ${messageId})`, []);
      const [readmsg] = itExist.rows;
      if (readmsg === undefined) {
        await CRUD.insert('read', '(user_id, message_id)', toDBArray(read));
      }
    } else return errorResponse(400, 'Message does not exixt', res);

    return res.status(200).json({
      status: 'Successful',
      data: message,
    });
  }
}

export default EpicMessage;