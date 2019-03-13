const testmessages = [
  {
    subject: 'embedded c',
    message: 'embedded c are very complex to test',
    senderId: 1,
    receiverId: 2,
    parentMessageId: 1,
    status: 'draft',
  },

  {
    subject: 'PWM',
    message: 'pulse width modulation can help control digital switches',
    senderId: 1,
    receiverId: 2,
    parentMessageId: 1,
    status: 'sent',
  },

  {
    subject: 'CSS transitions',
    message: 'making UI pages cooler',
    senderId: 2,
    receiverId: 1,
    parentMessageId: 2,
    status: 'read',
  },

  {
    subject: 'ES6',
    message: 'for effective coding',
    senderId: 1,
    receiverId: 2,
    parentMessageId: 2,
    status: 'unread',
  },

  {
    subject: 'incorrect data',
    message: 'for effective texting',
    senderId: 3,
    receiverId: 'user',
    parentMessageId: 2,
    status: 'unreaddgdy',
  },
];


export default testmessages;
