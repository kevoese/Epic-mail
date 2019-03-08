import messages from '../Models/messages';

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
}

export default EpicMessage;
