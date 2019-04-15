/* eslint-disable max-len */
/* eslint-disable camelcase */
import errorResponse from '../../helper/errorResponse';
import pool from '../../helper/db_query/queryMethod';
import queries from '../../helper/db_query/queries';

const { userQuery, msgQuery } = queries;

class EpicMessage {
  static async newMessage(req, res) {
    const senderId = req.decoded;
    let {
      subject, message, status, receiverEmail, parentMessageId,
    } = req.body;
    subject = subject.trim();
    message = message.trim();
    status = status.trim();
    receiverEmail = receiverEmail.trim();
    let threadId = null;
    const receiver = await pool.query(userQuery.getEmail, [receiverEmail]);
    if (receiver.rows[0] === undefined) return errorResponse(404, 'Receiver email does not exist', res);
    const receiverId = receiver.rows[0].id;
    if (senderId === receiverId) return errorResponse(400, 'Unable to create email', res);

    if (parentMessageId === undefined) parentMessageId = null;
    else {
      const checkParentMsg = await pool.query(msgQuery.getParentMsg, [parentMessageId, senderId]);
      if (checkParentMsg.rows[0] === undefined) {
        return errorResponse(400, 'Invalid parent message', res);
      }
      threadId = checkParentMsg.rows[0].thread_id;
      if (!threadId) {
        const thread = await pool.query(msgQuery.insertNewThread, [receiverId, senderId]);
        threadId = thread.rows[0].id;
        await pool.query(msgQuery.updateParentMsg, [threadId, parentMessageId]);
        await pool.query(msgQuery.updateParentMsgInbox, [threadId, parentMessageId]);
        await pool.query(msgQuery.updateParentMsgSent, [threadId, parentMessageId]);
      }
    }

    const read_status = 'unread';
    const msgArray = [
      subject,
      message,
      receiverId,
      senderId,
      parentMessageId,
      threadId,
    ];
    try {
      const { rows } = await pool.query(msgQuery.insertNewMsg, msgArray);
      const newData = rows[0];
      const { id } = newData;
      const sentArray = [
        id,
        subject,
        message,
        senderId,
        receiverId,
        parentMessageId,
        status,
        threadId,
      ];
      const inboxArray = [
        id,
        subject,
        message,
        receiverId,
        senderId,
        parentMessageId,
        read_status,
        threadId,
      ];
      await pool.query(msgQuery.insertNewSentMsg, sentArray);
      if (status === 'sent') {
        await pool.query(msgQuery.insertNewInboxMsg, inboxArray);
      }
      return res.status(200).send({
        status: 'Successful',
        data: newData,
      });
    } catch (err) {
      return errorResponse(500, 'Something went wrong', res);
    }
  }

  static async receivedMessage(req, res) {
    const userId = req.decoded;
    const receivedMessages = await pool.query(msgQuery.getInbox, [userId]);
    if (receivedMessages.rows[0] === undefined) {
      return res.status(200).send({
        status: 'Empty',
        data: 'Inbox is empty',
      });
    }
    return res.status(200).send({
      status: 'Successful',
      data: receivedMessages.rows,
    });
  }

  static async unreadMessage(req, res) {
    const userId = req.decoded;
    const unread = await pool.query(msgQuery.getUnread, [userId]);
    if (unread.rows[0] === undefined) {
      return res.status(200).send({
        status: 'Empty',
        data: 'No unread messages',
      });
    }
    return res.status(200).send({
      status: 'Successful',
      data: unread.rows,

    });
  }

  static async msgThread(req, res) {
    const userId = req.decoded;
    const { id } = req.params;
    const thread = await pool.query(msgQuery.getThread, [id, userId]);
    if (thread.rows[0] === undefined) {
      return errorResponse(400, 'Bad request', res);
    }
    return res.status(200).send({
      status: 'Successful',
      data: thread.rows,

    });
  }

  static async readMessage(req, res) {
    const userId = req.decoded;
    const read = await pool.query(msgQuery.getRead, [userId]);
    if (read.rows[0] === undefined) {
      return res.status(200).send({
        status: 'Empty',
        data: 'No read messages',
      });
    }
    return res.status(200).send({
      status: 'Successful',
      data: read.rows,
    });
  }

  static async sentMessage(req, res) {
    const userId = req.decoded;
    const sent = await pool.query(msgQuery.getSent, [userId]);
    if (sent.rows[0] === undefined) {
      return res.status(200).send({
        status: 'Empty',
        data: 'Sent box is empty',
      });
    }
    return res.status(200).send({
      status: 'Successful',
      data: sent.rows,
    });
  }

  static async draftMessage(req, res) {
    const userId = req.decoded;
    const draft = await pool.query(msgQuery.getDraft, [userId]);
    if (draft.rows[0] === undefined) {
      return res.status(200).send({
        status: 'Empty',
        data: 'Draft box is empty',
      });
    }
    return res.status(200).send({
      status: 'Successful',
      data: draft.rows,
    });
  }

  static async specificMessage(req, res) {
    const messageId = req.params.id;
    const userId = req.decoded;
    let thisMessage;
    try {
      const result = await pool.query(msgQuery.getMessageUsers, [messageId]);
      const { sender_id } = result.rows[0];
      let specificmsg;
      if (sender_id === userId) {
        specificmsg = await pool.query(msgQuery.getFromSent, [messageId, userId]);
      } else {
        specificmsg = await pool.query(msgQuery.getFromInbox, [messageId, userId]);
        await pool.query(msgQuery.updateReadStat, [messageId, userId]);
      }
      [thisMessage] = specificmsg.rows;
      if (!thisMessage.read_status && thisMessage.group_id) await pool.query(msgQuery.updateReadStat, [messageId, userId]);
    } catch (err) {
      return errorResponse(404, 'Message does not exist', res);
    }
    return res.status(200).json({
      status: 'Successful',
      data: thisMessage,
    });
  }

  static async deleteMessage(req, res) {
    const messageId = req.params.id;
    const userId = req.decoded;
    try {
      const { rows } = await pool.query(msgQuery.getMessageUsers, [messageId]);
      const { sender_id } = rows[0];
      if (sender_id === userId) {
        await pool.query(msgQuery.delSentMsg, [messageId]);
      } else {
        await pool.query(msgQuery.delInboxMsg, [messageId]);
      }
    } catch (err) {
      return errorResponse(404, 'Message does not exist', res);
    }
    return res.status(200).json({
      status: 'Successful',
      data: 'Message successfully deleted',
    });
  }
}

export default EpicMessage;
