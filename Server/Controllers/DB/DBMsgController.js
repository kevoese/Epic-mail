/* eslint-disable camelcase */
import CRUD from '../../helper/db_query/crud_db';
import helper from '../../helper/myFunction';
import errorResponse from '../../helper/errorResponse';
import { pool } from '../../helper/db_query/queryMethod';

const { toDBArray } = helper;

class EpicMessage {
  static async newMessage(req, res) {
    let { parentMessageId } = req.body;
    if (parentMessageId === undefined) parentMessageId = null;
    try {
      const {
        subject, message, status, receiverEmail,
      } = req.body;
      const [receiver] = await CRUD.find('users', 'email', receiverEmail);
      if (!receiver) return errorResponse(400, 'Receiver email does not exist', res);
      const receiverId = receiver.id;
      const senderId = req.decoded;
      if (senderId === receiverId) return errorResponse(400, 'Unable to create email', res);
      const createdOn = new Date();
      const receiverDelete = false;
      const msgObj = {
        createdOn,
        subject,
        message,
        receiverId,
        senderId,
        parentMessageId,
        status,
        receiverDelete,
      };
      const [newData] = await CRUD.insert('messages',
        '(created_on, subject, message, receiver_id, sender_id, parent_message_id, status, receiver_del)',
        toDBArray(msgObj));
      const { id } = newData;
      return res.status(200).send({
        status: 'Successful',
        data: {
          id, createdOn, subject, message, parentMessageId, status,
        },
      });
    } catch (err) {
      return errorResponse(400, 'Unable to create email', res);
    }
  }


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
