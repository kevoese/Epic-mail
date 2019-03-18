// import errorResponse from '../helper/errorResponse';
// import database from '../helper/crud';

// class EpicMessage {
//   static newMessage(req, res) {
//     const {
//       subject, message, parentMessageId, status, receiverEmail,
//     } = req.body;
//     const receiver = database.findItem('users', 'email', receiverEmail);
//     if (receiver === undefined) return errorResponse(400, 'Receiver email does not exist', res);
//     const receiverId = receiver.id;
//     const senderId = req.decoded;
//     if (senderId === Number(receiverId)) return errorResponse(400, 'unable to create email', res);
//     const createdOn = new Date();
//     const senderDelete = false;
//     const receiverDelete = false;
//     const msgObj = {
//       subject,
//       message,
//       parentMessageId,
//       createdOn,
//       senderId,
//       receiverId,
//       senderDelete,
//       receiverDelete,
//       status,
//     };
//     const newData = database.add('messages', msgObj);
//     const { id } = newData;
//     return res.status(200).send({
//       status: 'Successful',
//       data: {
//         id, createdOn, subject, message, parentMessageId, status,
//       },
//     });
//   }

//   static receivedMessage(req, res) {
//     const userId = req.decoded;
//     const receivedMessages = database.sortItem('messages', 'receiverId', userId);
//     return res.status(200).send({
//       status: 'Successful',
//       data: receivedMessages,
//     });
//   }

//   static unreadMessage(req, res) {
//     const userId = req.decoded;
//     const receivedMessages = database.sortItem('messages', 'receiverId', userId);
//     let unread = [...receivedMessages];
//     const readData = database.sortItem('read', 'userId', userId);
//     readData.forEach((read) => {
//       unread = unread.filter(unreadData => unreadData.id !== read.messageId);
//     });

//     return res.status(200).send({
//       status: 'Successful',
//       data: unread,

//     });
//   }

//   static sentMessage(req, res) {
//     const userId = req.decoded;
//     const sortMessage = database.sortItem('messages', 'senderId', userId);
//     const sentMessages = sortMessage.filter(element => element.status === 'sent');
//     return res.status(200).send({
//       status: 'Successful',
//       data: sentMessages,
//     });
//   }

//   static draftMessage(req, res) {
//     const userId = req.decoded;
//     const sentMessages = database.sortItem('messages', 'senderId', userId);
//     const draftMessages = sentMessages.filter(element => element.status === 'draft');
//     return res.status(200).send({
//       status: 'Successful',
//       data: draftMessages,
//     });
//   }

//   static specificMessage(req, res) {
//     let messageId = req.params.id;
//     const userId = req.decoded;
//     const message = database.getById('messages', messageId, userId);
//     if (!message) {
//       return errorResponse(400, 'message does not exist', res);
//     }
//     messageId = Number(messageId);
//     const read = { userId, messageId };
//     database.add('read', read);
//     message.isRead = true;
//     return res.status(200).send({
//       status: 'Successful',
//       data: message,
//     });
//   }

//   static deleteMessage(req, res) {
//     const messageId = req.params.id;
//     const userId = req.decoded;
//     const message = database.deletemsg('messages', messageId, userId);
//     if (!message) {
//       return errorResponse(400, 'Invalid! message does not exist', res);
//     }

//     return res.status(200).send({
//       status: 'Successful',
//       data: { message },
//     });
//   }
// }

// export default EpicMessage;
