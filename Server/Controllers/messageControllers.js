import errorResponse from '../helper/errorResponse';
import database from '../helper/crud';

class EpicMessage {
  static newMessage(req, res) {
    const {
      subject, message, parentMessageId, status, senderId, receiverId,
    } = req.body;
    const createdOn = new Date();
    const senderDelete = false;
    const receiverDelete = false;
    const msgObj = {
      subject,
      message,
      parentMessageId,
      createdOn,
      senderId,
      receiverId,
      senderDelete,
      receiverDelete,
      status,
    };
    const newData = database.add('messages', msgObj);
    const { id } = newData;
    return res.status(200).json({
      status: 200,
      data: {
        id, createdOn, subject, message, parentMessageId, status,
      },
    });
  }

  static receivedMessage(req, res) {
    const userId = req.decoded;
    const receivedMessages = database.sortItem('messages', 'receiverId', userId);
    return res.status(200).json({
      status: 200,
      data: receivedMessages,
    });
  }

  static unreadMessage(req, res) {
    const userId = req.decoded;
    const receivedMessages = database.sortItem('messages', 'receiverId', userId);
    let unread = [...receivedMessages];
    const readData = database.sortItem('read', 'userId', userId);
    readData.forEach((read) => {
      unread = unread.filter(unreadData => unreadData.id !== read.messageId);
    });

    return res.status(200).json({
      status: 200,
      data: unread,

    });
  }

  static sentMessage(req, res) {
    const userId = req.decoded;
    const sortMessage = database.sortItem('messages', 'senderId', userId);
    const sentMessages = sortMessage.filter(element => element.status === 'sent');
    return res.status(200).json({
      status: 200,
      data: sentMessages,
    });
  }

  static draftMessage(req, res) {
    const userId = req.decoded;
    const sentMessages = database.sortItem('messages', 'senderId', userId);
    const draftMessages = sentMessages.filter(element => element.status === 'draft');
    return res.status(200).json({
      status: 200,
      data: draftMessages,
    });
  }

  static specificMessage(req, res) {
    let messageId = req.params.id;
    const userId = req.decoded;
    const message = database.getById('messages', messageId, userId);
    if (!message) {
      return errorResponse(400, 'message does not exist', res);
    }
    messageId = Number(messageId);
    const read = { userId, messageId };
    database.add('read', read);
    message.isRead = true;
    return res.status(200).json({
      status: 200,
      data: message,
    });
  }

  static deleteMessage(req, res) {
    const messageId = req.params.id;
    const userId = req.decoded;
    const message = database.deletemsg('messages', messageId, userId);
    if (!message) {
      return errorResponse(400, 'Invalid! message does not exist', res);
    }

    return res.status(200).json({
      status: 200,
      data: { message },
    });
  }
}

export default EpicMessage;
