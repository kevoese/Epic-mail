/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable camelcase */
const readLabel = document.querySelector('#readLabel');
const unreadLabel = document.querySelector('#unreadLabel');


const messagepanel = (msgObj) => {
  const {
    message_id, Name, message, subject, status, datestr, group_name,
  } = msgObj;
  const groupnamehtml = (group_name) ? `<p class="groupname_msg icon">${group_name}</p>` : ' ';
  const msghtml = `<div id = "${message_id}_small" class="wrapmsghead icon ${status}msg">
    <p class="username icon">${Name}</p>
    ${groupnamehtml}
    <p class="msgdate icon">${datestr}</p>
    <p class="msgtitle">
       ${subject}
    </p>
    <p class="msgcontent">${message}</p>
    <div class = "deletediv">
    <span class="delete icon" data-tool-tip="Delete"></span>
    </div>
</div> `;

  return msghtml;
};

const messageView = (msgObj, thread = false) => {
  const {
    senderName, receiverName, message_id, subject, message, profileImg, datestr, status,
  } = msgObj;
  const draftbtn = (status === 'draft') ? '<button id = "draftbtn" class="draftbtn icon"></button>' : ' ';
  const threadbtnhtml = (thread) ? `<button id = '${thread}_thread' class="viewthread">View thread</button>` : ' ';
  const replybtnhtml = (receiverName === 'You') ? '<button id = "replybtn" class="replybtn icon">Reply</button>' : ' ';
  const msghtml = ` <div id = "${message_id}_big" class="messagewrap">
  <div class="msginfo">
      <span class="subject">${subject}</span>
      <span class="sender">${senderName}</span>
      <span class="from">From:</span>
      <span class="to icon">to</span>
      <span class="receiver">${receiverName}</span>
      ${threadbtnhtml}
      <img src="${profileImg}" class="senderimg">
      <span class="messageDate icon">(${datestr})</span> 
  </div>
  <p class = "msgP">
      ${message}
  </p>
  ${replybtnhtml}
  <button id = "fwdbtn" class="fwdbtn icon">Forward</button> 
  ${draftbtn}
  </div>`;

  return msghtml;
};

const groupContacts = (grpArr) => {
  let optiontags = '';
  grpArr.forEach((group) => {
    optiontags += ` <option id = "${group.id}"  >${group.name}</option>`;
  });
  grpContacthtml = `<option  disabled selected>Choose Groups</option>
   ${optiontags}`;
  return grpContacthtml;
};

const getContacts = (contactArr) => {
  let optiontags = '';
  contactArr.forEach((contact) => {
    optiontags += ` <option id = "${contact.user_id}" >${contact.contact_email}</option>`;
  });
  Contacthtml = `
   <option  disabled selected>Select contact</option>
   ${optiontags}
`;
  return Contacthtml;
};

const populateInbox = async (type = false) => {
  const inboxhtml = document.querySelector('.all');
  const inboxNum = document.querySelector('#allbutton');
  let url;
  let empty;
  if (type) {
    empty = (type === 'unread') ? 'There are no unread messages' : 'No messages have been read';
    url = (type === 'unread') ? `${appurl}messages/unread` : `${appurl}messages/read`;
  } else {
    empty = 'Inbox is empty';
    url = `${appurl}messages`;
  }

  const { responseObj } = await fetchCall(url, 'GET');
  if (responseObj.status === 'Successful') {
    const { data } = responseObj;
    if (type === 'read') readLabel.textContent = `Read(${data.length})`;
    if (type === 'unread') {
      unreadLabel.textContent = `Unread(${data.length})`;
      const notif = (data.length < 1) ? ' ' : data.length;
      inboxNum.setAttribute('box', notif);
    }
    inboxhtml.innerHTML = await data.reduce(async (promise_acc, rMessage) => {
      let acc = await promise_acc;
      const {
        message_id, subject, message, read_status, created_on, group_id,
      } = rMessage;
      const datestr = getDateStr(created_on);
      const { firstname, lastname } = await getUser(rMessage.sender_id);
      const Name = `${firstname} ${lastname}`;
      let group_name = false;
      if (group_id) {
        const groupDetail = await fetchCall(`${appurl}groups/${group_id}/users`, 'GET');
        const { name } = groupDetail.responseObj.data[0];
        group_name = name;
      }
      const status = read_status;
      const msgObj = {
        Name, message_id, subject, message, status, datestr, group_name,
      };
      acc = acc.concat(messagepanel(msgObj));
      return Promise.resolve(acc);
    }, Promise.resolve(''));
  }
  if (responseObj.status === 'Empty') {
    if (type === 'read') readLabel.textContent = `Read(${0})`;
    else if (type === 'unread') {
      unreadLabel.textContent = `Unread(${0})`;
      inboxNum.setAttribute('box', ' ');
    }
    else inboxhtml.innerHTML = emptyMsgBox(empty);
  }
};


const populateOutbox = async (type) => {
  const boxhtml = document.querySelector(`.${type}`);
  const url = (type === 'sent') ? `${appurl}messages/sent` : `${appurl}messages/draft`;
  const { responseObj } = await fetchCall(url, 'GET');
  if (responseObj.status === 'Successful') {
    const { data } = responseObj;
    boxhtml.innerHTML = await data.reduce(async (promise_acc, rMessage) => {
      let acc = await promise_acc;
      const {
        message_id, subject, message, status, created_on, group_id,
      } = rMessage;
      const datestr = getDateStr(created_on);
      const { firstname, lastname } = await getUser(rMessage.receiver_id);
      const Name = `${firstname} ${lastname}`;
      let group_name = false;
      if (group_id) {
        const groupDetail = await fetchCall(`${appurl}groups/${group_id}/users`, 'GET');
        const { name } = groupDetail.responseObj.data[0];
        group_name = name;
      }
      const msgObj = {
        Name, message_id, subject, message, status, datestr, group_name,
      };
      acc = acc.concat(messagepanel(msgObj));
      return Promise.resolve(acc);
    }, Promise.resolve(' '));
  }
  if (responseObj.status === 'Empty') boxhtml.innerHTML = emptyMsgBox(`${type} box is empty`);
};

const populateView = async (msgId) => {
  const url = `${appurl}messages/${msgId}`;
  const { responseObj } = await fetchCall(url, 'GET');
  if (responseObj.status === 'Successful') {
    const { data } = responseObj;
    const {
      message_id, subject, message, created_on, sender_id, receiver_id, user_id, group_id, status, thread_id,
    } = data;
    if (status) {
      receiverId = receiver_id;
      senderId = user_id;
    } else {
      receiverId = user_id;
      senderId = sender_id;
    }
    let group_name = false;
    if (group_id) {
      const groupDetail = await fetchCall(`${appurl}groups/${group_id}/users`, 'GET');
      const { name } = groupDetail.responseObj.data[0];
      group_name = name;
    }
    const datestr = getDateStr(created_on);
    const sender = await getUser(senderId);
    const receiver = await getUser(receiverId);
    const senderEmail = sender.email;
    const receiverEmail = receiver.email;
    const senderName = (thisUser.email === senderEmail) ? 'You' : `${sender.firstname} ${sender.lastname} <p class = 'sEmail'> < ${senderEmail} > </p>`;
    let receiverName = (thisUser.email === receiverEmail) ? 'You' : `${receiver.firstname} ${receiver.lastname} <p class = 'rEmail'> < ${receiverEmail} > </p>`;
    if (group_id) receiverName = group_name;
    const profileImg = (thisUser.email === senderEmail) ? receiver.profile_pic : sender.profile_pic;
    const msgObj = {
      senderName, receiverName, message_id, subject, message, profileImg, datestr, status,
    };
    view.innerHTML = messageView(msgObj, thread_id);
  }
  if (responseObj.status === 'Failure') {
    console.log('bad request');
  }
};

const deleteMsgEndpoint = async (msgId) => {
  const url = `${appurl}messages/${msgId}`;
  const { responseObj } = await fetchCall(url, 'DELETE');
  if (responseObj.status === 'Successful') return true;
  return false;
};

const populateGrpContact = async () => {
  const url = `${appurl}groups`;
  const { responseObj } = await fetchCall(url, 'GET');
  if (responseObj.status === 'Successful') {
    addGrpContact.innerHTML = groupContacts(responseObj.data);
  } else if (responseObj.status === 'Empty') {
    addGrpContact.innerHTML = groupContacts([]);
  }
};

const populateThread = async (threadId) => {
  const url = `${appurl}messages/thread/${threadId}`;
  const { responseObj, statusCode } = await fetchCall(url, 'GET');

  if (statusCode === 200) {
    const { data } = responseObj;
    view.innerHTML = await data.reduce(async (promise_acc, dataObj) => {
      let acc = await promise_acc;
      const {
        id, subject, message, created_on, sender_id, receiver_id,
      } = dataObj;
      const message_id = id;
      const datestr = getDateStr(created_on);
      const sender = await getUser(sender_id);
      const receiver = await getUser(receiver_id);
      const senderEmail = sender.email;
      const receiverEmail = receiver.email;
      const senderName = (thisUser.email === senderEmail) ? 'You' : `${sender.firstname} ${sender.lastname} <p class = 'sEmail'> < ${senderEmail} > </p>`;
      const receiverName = (thisUser.email === receiverEmail) ? 'You' : `${receiver.firstname} ${receiver.lastname} <p> < ${receiverEmail} > </p>`;
      const profileImg = (thisUser.email === senderEmail) ? receiver.profile_pic : sender.profile_pic;
      const msgObj = {
        senderName, receiverName, message_id, subject, message, profileImg, datestr,
      };
      acc = acc.concat(messageView(msgObj));
      return Promise.resolve(acc);
    }, Promise.resolve(' '));
  }
  if (statusCode === 400) {
    console.log('bad request');
  }
};

const populateContacts = async () => {
  const url = `${appurl}user/contacts`;
  const { responseObj, statusCode } = await fetchCall(url, 'GET');
  if (statusCode === 200) {
    contacts.innerHTML = getContacts(responseObj.data);
  } else if (statusCode === 201) {
    contacts.innerHTML = getContacts([]);
  }
};
