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
      let {
        subject, message, status, receiverEmail,
      } = req.body;
      subject = subject.trim();
      message = message.trim();
      status = status.trim();
      receiverEmail = receiverEmail.trim();
      const [receiver] = await CRUD.find('users', 'email', receiverEmail);
      if (!receiver) return errorResponse(404, 'Receiver email does not exist', res);
      const receiverId = receiver.id;
      const senderId = req.decoded;
      if (senderId === receiverId) return errorResponse(400, 'Unable to create email', res);
      const createdOn = new Date();
      const receiverDelete = false;
      const read_stat = 'unread';
      const msgObj = {
        createdOn,
        subject,
        message,
        receiverId,
        senderId,
        parentMessageId,
        status,
        receiverDelete,
        read_stat,
      };
      const [newData] = await CRUD.insert('messages',
        '(created_on, subject, message, receiver_id, sender_id, parent_message_id, status, receiver_del, read_stat)',
        toDBArray(msgObj));
      const { id } = newData;

      return res.status(200).send({
        status: 'Successful',
        data: {
          id, createdOn, subject, message, parentMessageId, status,
        },
      });
    } catch (err) {
      return errorResponse(500, 'Something went wrong', res);
    }
  }

  static async receivedMessage(req, res) {
    const userId = req.decoded;
    const receivedMessages = await pool.query(`SELECT * FROM messages WHERE receiver_id = ${userId}`);
    const groups = await pool.query(`SELECT group_id FROM joint WHERE member = ${userId}`);
    if (groups.rows[0] !== undefined) {
      return groups.rows.forEach(group => pool.query(`SELECT * FROM messages WHERE groupid = ${group.group_id}`)
        .then((groupMsg) => {
          const inbox = [...receivedMessages.rows];
          if (groupMsg.rows[0] !== undefined) {
            inbox.push(groupMsg.rows);
            return res.status(200).send({
              status: 'Successful',
              data: inbox,
            });
          }
        }));
    }
    if (receivedMessages.rows[0] === undefined) {
      return errorResponse(404, 'inbox is empty', res);
    }
    return res.status(200).send({
      status: 'Successful',
      data: receivedMessages.rows,
    });
  }

  static async unreadMessage(req, res) {
    const userId = req.decoded;
    const unread = await pool.query(`SELECT id, created_on, subject, message, receiver_id, sender_id, status FROM messages WHERE (receiver_id = ${userId} AND read_stat = 'unread' )`);
    if (unread.rows[0] === undefined) {
      return errorResponse(404, 'No unread messages', res);
    }
    return res.status(200).send({
      status: 'Successful',
      data: unread.rows,

    });
  }


  static async sentMessage(req, res) {
    const userId = req.decoded;
    const sortMessage = await CRUD.find('messages', 'sender_id', userId);
    if (sortMessage[0] === undefined) {
      return errorResponse(404, 'No sent message', res);
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
      return errorResponse(404, 'No draft message', res);
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
    let messagedata = ' No message available';
    if (rows[0] !== undefined) {
      const { receiver_id } = rows[0];
      if (receiver_id === userId) {
        const result = await pool.query(`UPDATE messages SET read_stat = 'read' WHERE (id = ${messageId}) AND (receiver_id = ${userId}) RETURNING *`);
      }
      const {
        id, created_on, subject, message, sender_id, status,
      } = rows[0];
      messagedata = {
        id, created_on, subject, message, receiver_id, sender_id, status,
      };
    } else return errorResponse(404, 'Message does not exixt', res);

    return res.status(200).json({
      status: 'Successful',
      data: messagedata,
    });
  }

  static async deleteMessage(req, res) {
    const messageId = req.params.id;
    const userId = req.decoded;
    let message;
    try {
      message = await CRUD.find('messages', 'id', messageId);
    } catch (error) {
      return errorResponse(404, 'Message not found', res);
    }


    if (!message[0]) {
      return errorResponse(404, 'Message not found', res);
    }

    const { sender_id, receiver_id } = message[0];
    if ((sender_id !== userId) && (receiver_id !== userId)) {
      return errorResponse(404, 'Message not found', res);
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
