import messages from '../Models/messages';
import errorResponse from '../helper/errorResponse';

class EpicMessage {
  static newMessage(req, res) {
    const {
      subject, message, parentMessageId, status, senderId, receiverId,
    } = req.body;
    const id = messages.length + 1;
    const createdOn = new Date();
    const msgObj = {
      id, subject, message, parentMessageId, status, createdOn, senderId, receiverId,
    };
    messages.push(msgObj);
    return res.status(200).json({
      status: 200,
      data: {
        id, createdOn, subject, message, parentMessageId, status,
      },
    });
  }

  static receivedMessage(req, res) {
    const receivedMessages = messages.filter(message => (message.status === 'read' || message.status === 'unread'));
    return res.status(200).json({
      status: 200,
      data: receivedMessages,
    });
  }

  static unreadMessage(req, res) {
    const unreadMessages = messages.filter(message => (message.status === 'unread'));
    return res.status(200).json({
      status: 200,
      data: unreadMessages,
    });
  }

  static sentMessage(req, res) {
    const sentMessages = messages.filter(message => (message.status === 'sent'));
    return res.status(200).json({
      status: 200,
      data: sentMessages,
    });
  }

  static specificMessage(req, res) {
    const messageId = req.params.id;
    const message = messages[messageId - 1];
    if (!message) {
      return errorResponse(400, 'message does not exist', res);
    }
    return res.status(200).json({
      status: 200,
      data: message,
    });
  }
}

export default EpicMessage;
