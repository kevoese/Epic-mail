const testmessages = [
  {
    subject: 'embedded c',
    message: 'embedded c are very complex to test',
    receiverEmail: 'joe@epicmail.com',
    status: 'sent',
  },

  {
    subject: 'PWM',
    message: 'pulse width modulation can help control digital switches',
    receiverEmail: 'joe@epicmail.com',
    status: 'draft',
  },

  {
    subject: 'incorrect data',
    message: 'for effective texting',
    receiverEmail: 'joe',
    parentMessageId: 2,
    status: 'sentdgdy',
  },
  {
    subject: 'incorrect data',
    message: 'for effective texting',
    receiverEmail: 'joe@epicmail.com',
    status: 'sent',
  },

  {
    receiverEmail: 'kevoese@epicmail.com',
    subject: 'good afterall',
    message: 'very very nice and good',
    status: 'sent',
    parentMessageId: 2,
  },
];


export default testmessages;
