const testmessages = [
  {
    subject: 'embedded c',
    message: 'embedded c are very complex to test',
    receiverEmail: 'joe@epicmail.com',
    parentMessageId: 1,
    status: 'draft',
  },

  {
    subject: 'PWM',
    message: 'pulse width modulation can help control digital switches',
    receiverEmail: 'joe@epicmail.com',
    parentMessageId: 1,
    status: 'sent',
  },

  {
    subject: 'CSS transitions',
    message: 'making UI pages cooler',
    receiverEmail: 'joe@epicmail.com',
    parentMessageId: 2,
    status: 'draft',
  },

  {
    subject: 'ES6',
    message: 'for effective coding',
    receiverEmail: 'joe@epicmail.com',
    parentMessageId: 2,
    status: 'sent',
  },

  {
    subject: 'incorrect data',
    message: 'for effective texting',
    receiverEmail: 'joe',
    parentMessageId: 2,
    status: 'sentdgdy',
  },
];


export default testmessages;
