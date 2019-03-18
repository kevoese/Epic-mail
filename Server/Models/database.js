const database = {
  users: [
    {

      email: 'joe@epicmail.com',
      firstname: 'joe',
      lastname: 'big',
      passwordhash: '$2b$10$aIX9BSqaiIH.LervjgHycOjNVEmykleVGi6.HSgL7i1m7flaW45Va',
    },
    {

      email: 'cyrax@epicmail.com',
      firstname: 'cyrax',
      lastname: 'tejiri',
      passwordhash: '$2b$10$aIX9BSqaiIH.LervjgHycOjNVEmykleVGi6.HSgL7i1m7flaW45Va',
    },
  ],

  messages: [
    {

      createdOn: 'feb 20 2001',
      subject: 'embedded c',
      message: 'embedded c are very complex to test',
      senderId: 2,
      receiverId: 3,
      parentMessageId: 0,
      status: 'sent',
      receiverDelete: false,
    },

    {

      createdOn: 'feb 20 2001',
      subject: 'PWM',
      message: 'pulse width modulation can help control digital switches',
      senderId: 3,
      receiverId: 2,
      parentMessageId: 0,
      status: 'sent',
      receiverDelete: false,
    },

    {

      createdOn: 'feb 20 2001',
      subject: 'CSS transitions',
      message: 'making UI pages cooler',
      senderId: 3,
      receiverId: 2,
      parentMessageId: 2,
      status: 'sent',
      receiverDelete: false,
    },

    {

      createdOn: 'feb 20 2001',
      subject: 'ES6',
      message: 'for effective coding',
      senderId: 3,
      receiverId: 2,
      parentMessageId: 2,
      status: 'draft',
      receiverDelete: false,
    },

    {

      createdOn: 'feb 20 2012',
      subject: 'making good music',
      message: 'we all love a good music',
      senderId: 3,
      receiverId: 2,
      parentMessageId: 14,
      status: 'draft',
      receiverDelete: false,
    },

    {

      createdOn: 'feb 20 2001',
      subject: 'dancing',
      message: 'love dancing',
      senderId: 2,
      receiverId: 3,
      parentMessageId: 2,
      status: 'draft',
      receiverDelete: false,
    },

    {

      createdOn: 'feb 20 2001',
      subject: 'Andela',
      message: 'This is andela',
      senderId: 2,
      receiverId: 3,
      parentMessageId: 7,
      status: 'draft',
      receiverDelete: false,
    },

    {

      createdOn: 'feb 20 2001',
      subject: 'Igugu',
      message: 'Route to agbara',
      senderId: 2,
      receiverId: 3,
      parentMessageId: 7,
      status: 'draft',
      receiverDelete: false,
    },

    {

      createdOn: 'feb 20 2001',
      subject: 'Quotes',
      message: 'If wishes were horses Beggers would ride',
      senderId: 3,
      receiverId: 2,
      parentMessageId: 7,
      status: 'sent',
      receiverDelete: false,
    },

    {
      createdOn: 'feb 20 2001',
      subject: 'One bright summer morning',
      message: 'by james hadley chase',
      senderId: 5,
      receiverId: 6,
      parentMessageId: 0,
      status: 'draft',
      receiverDelete: false,
    },

    {
      createdOn: 'feb 20 2001',
      subject: 'James hadley chase',
      message: 'This is for real',
      senderId: 5,
      receiverId: 7,
      parentMessageId: 1,
      status: 'sent',
      receiverDelete: false,
    },

    {
      createdOn: 'feb 20 2001',
      subject: 'Christiano Ronaldo',
      message: 'CR7 world best footballer',
      senderId: 5,
      receiverId: 6,
      parentMessageId: 1,
      status: 'sent',
      receiverDelete: false,
    },
  ],


  read: [
    {
      userId: 2,
      messageId: 3,
    },
    {

      userId: 1,
      messageId: 3,
    },
    {

      userId: 2,
      messageId: 6,
    },
    {

      userId: 3,
      messageId: 6,
    },
    {

      userId: 3,
      messageId: 4,
    },
    {

      userId: 3,
      messageId: 3,
    },
  ],

  groups: [

  ],
};

export default database;
