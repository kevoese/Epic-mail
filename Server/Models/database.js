const database = {
  users: [
    // {
    //   id: 1,
    //   email: 'joe@epicmail.com',
    //   firstname: 'kelvin',
    //   lastname: 'esegbona',
    //   password: '$2b$10$aIX9BSqaiIH.LervjgHycOjNVEmykleVGi6.HSgL7i1m7flaW45Va',
    // },
  ],

  messages: [
    {
      id: 1,
      createdOn: 'feb 20 2001',
      subject: 'embedded c',
      message: 'embedded c are very complex to test',
      senderId: 2,
      receiverId: 1,
      parentMessageId: 0,
      status: 'sent',
      receiverDelete: false,
    },

    {
      id: 2,
      createdOn: 'feb 20 2001',
      subject: 'PWM',
      message: 'pulse width modulation can help control digital switches',
      senderId: 1,
      receiverId: 2,
      parentMessageId: 0,
      status: 'sent',
      receiverDelete: false,
    },

    {
      id: 3,
      createdOn: 'feb 20 2001',
      subject: 'CSS transitions',
      message: 'making UI pages cooler',
      senderId: 1,
      receiverId: 2,
      parentMessageId: 2,
      status: 'sent',
      receiverDelete: false,
    },

    {
      id: 4,
      createdOn: 'feb 20 2001',
      subject: 'ES6',
      message: 'for effective coding',
      senderId: 1,
      receiverId: 2,
      parentMessageId: 2,
      status: 'draft',
      receiverDelete: false,
    },

    {
      id: 5,
      createdOn: 'feb 20 2012',
      subject: 'making good music',
      message: 'we all love a good music',
      senderId: 1,
      receiverId: 2,
      parentMessageId: 14,
      status: 'draft',
      receiverDelete: false,
    },

    {
      id: 6,
      createdOn: 'feb 20 2001',
      subject: 'dancing',
      message: 'love dancing',
      senderId: 1,
      receiverId: 2,
      parentMessageId: 2,
      status: 'draft',
      receiverDelete: false,
    },

    {
      id: 7,
      createdOn: 'feb 20 2001',
      subject: 'Andela',
      message: 'This is andela',
      senderId: 2,
      receiverId: 1,
      parentMessageId: 7,
      status: 'draft',
      receiverDelete: false,
    },

    {
      id: 8,
      createdOn: 'feb 20 2001',
      subject: 'Igugu',
      message: 'Route to agbara',
      senderId: 2,
      receiverId: 1,
      parentMessageId: 7,
      status: 'draft',
      receiverDelete: false,
    },

    {
      id: 9,
      createdOn: 'feb 20 2001',
      subject: 'Quotes',
      message: 'If wishes were horses Beggers would ride',
      senderId: 1,
      receiverId: 2,
      parentMessageId: 7,
      status: 'sent',
      receiverDelete: false,
    },

    {
      id: 10,
      createdOn: 'feb 20 2001',
      subject: 'One bright summer morning',
      message: 'by james hadley chase',
      senderId: 2,
      receiverId: 1,
      parentMessageId: 0,
      status: 'draft',
      receiverDelete: false,
    },

    {
      id: 11,
      createdOn: 'feb 20 2001',
      subject: 'James hadley chase',
      message: 'This is for real',
      senderId: 2,
      receiverId: 1,
      parentMessageId: 1,
      status: 'sent',
      receiverDelete: false,
    },

    {
      id: 12,
      createdOn: 'feb 20 2001',
      subject: 'Christiano Ronaldo',
      message: 'CR7 world best footballer',
      senderId: 3,
      receiverId: 4,
      parentMessageId: 1,
      status: 'sent',
      receiverDelete: false,
    },
  ],


  read: [
    {
      id: 1,
      userId: 2,
      messageId: 3,
    },
    {
      id: 2,
      userId: 1,
      messageId: 3,
    },
    {
      id: 3,
      userId: 2,
      messageId: 6,
    },
  ],

  groups: [

  ],
};

export default database;
