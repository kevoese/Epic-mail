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

  static async receivedMessage(req, res) {
    const userId = req.decoded;
    const receivedMessages = await CRUD.find('messages', 'receiver_id', userId);
    if (receivedMessages[0] === undefined) {
      return errorResponse(400, 'inbox is empty', res);
    }
    return res.status(200).send({
      status: 'Successful',
      data: receivedMessages,
    });
  }

  static async unreadMessage(req, res) {
    const userId = req.decoded;
    let unread = await CRUD.find('messages', 'receiver_id', userId);
    if (unread[0] === undefined) {
      return errorResponse(400, 'User does not have unread message', res);
    }
    const readData = await CRUD.find('read', 'user_id', userId);
    if (readData[0] === undefined) {
      return errorResponse(400, 'User does not have unread message', res);
    }
    readData.forEach((read) => {
      unread = unread.filter(unreadData => unreadData.id !== read.message_id);
    });

    return res.status(200).send({
      status: 'Successful',
      data: unread,

    });
  }

  static async sentMessage(req, res) {
    const userId = req.decoded;
    const sortMessage = await CRUD.find('messages', 'sender_id', userId);
    if (sortMessage[0] === undefined) {
      return errorResponse(400, 'User does not have any sent message', res);
    }
    const sentMessages = sortMessage.filter(element => element.status === 'sent');
    return res.status(200).send({
      status: 'Successful',
      data: sentMessages,
    });
  }

  static async draftMessage(req, res) {
    const userId = req.decoded;
    const sentMessages = await CRUD.find('messages', 'sender_id', userId);
    if (sentMessages[0] === undefined) {
      return errorResponse(400, 'User does not have any draft message', res);
    }
    const draftMessages = sentMessages.filter(element => element.status === 'draft');
    return res.status(200).json({
      status: 'Successful',
      data: draftMessages,
    });
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

  static async deleteMessage(req, res) {
    const messageId = req.params.id;
    const userId = req.decoded;
    let message;
    try {
      message = await CRUD.find('messages', 'id', messageId);
    } catch (error) {
      return errorResponse(400, 'Invalid! message does not exist', res);
    }


    if (!message[0]) {
      return errorResponse(400, 'Invalid! message does not exist', res);
    }

    const { sender_id, receiver_id } = message[0];
    if ((sender_id !== userId) && (receiver_id !== userId)) {
      return errorResponse(400, 'Invalid! message does not exist', res);
    }

    if (sender_id === userId) { await pool.query(`DELETE FROM messages WHERE id = ${messageId}`, []); }
    if (receiver_id === userId) {
      await pool
        .query(`UPDATE messages SET receiver_del = true WHERE id = ${messageId}`, []);
    }
    return res.status(200).json({
      status: 'Successful',
      data: 'Msessage successfully deleted',
    });
  }
}

export default EpicMessage;
