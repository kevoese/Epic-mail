/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable camelcase */
const readLabel = document.querySelector('#readLabel');
const unreadLabel = document.querySelector('#unreadLabel');

const getDateStr = (str) => {
  const end = str.indexOf('T');
  const rawDate = str.slice(0, end);
  const firstHyphen = rawDate.indexOf('-');
  const lastHyphen = rawDate.lastIndexOf('-');
  const year = rawDate.slice(0, firstHyphen);
  const month = rawDate.slice(firstHyphen + 1, lastHyphen);
  const day = rawDate.slice(lastHyphen + 1);
  const monthStrArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthStr = monthStrArr[Number(month) - 1];
  return `${monthStr} ${day} ${year}`;
};

const emptyMsgBox = message => `<p class="empty">
${message}
</p>`;


const messagepanel = (msgObj) => {
  const {
    message_id, Name, message, subject, status, datestr,
  } = msgObj;
  const msghtml = `<div id = "${message_id}_small" class="wrapmsghead icon ${status}msg">
    <p class="username icon">${Name}</p><p class="msgdate icon">${datestr}</p>
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

const messageView = (msgObj) => {
  const {
    senderName, receiverName, message_id, subject, message, profileImg, datestr,
  } = msgObj;
  const msghtml = ` <div id = "${message_id}_big" class="messagewrap">
  <div class="msginfo">
      <span class="subject">${subject}</span>
      <span class="sender">${senderName}</span>
      <span class="from">From:</span>
      <span class="to icon">to</span>
      <span class="receiver">${receiverName}</span>
      <span class="reply icon"></span>
      <img src="${profileImg}" class="senderimg">
      <span class="messageDate icon">(${datestr})</span> 
  </div>
  <p class = "msgP">
      ${message}
  </p>
  <button class="replybtn icon">Reply</button>
  <button class="fwdbtn icon">Forward</button> 
  </div>`;

  return msghtml;
};

const groupContacts = (grpArr) => {
  let optiontags = '';
  grpArr.forEach((group) => {
    optiontags += ` <option id = "${group.id}" class= "group.name" >${group.name}</option>`;
  });
  grpContacthtml = ` <select id = "grpcontacts" class="contactselect" name="gender" >
   <option  disabled selected>Choose Groups</option>
   ${optiontags}
</select>`;
  return grpContacthtml;
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
  inboxhtml.innerHTML = ' ';
  if (responseObj.status === 'Successful') {
    const { data } = responseObj;
    if (type === 'read') readLabel.textContent = `Read(${data.length})`;
    else if (type === 'unread') unreadLabel.textContent = `Unread(${data.length})`;
    else inboxNum.setAttribute('box', data.length);
    data.forEach(async (rMessage) => {
      const {
        message_id, subject, message, read_status, created_on,
      } = rMessage;
      const datestr = getDateStr(created_on);
      const { firstname, lastname } = await getUser(rMessage.sender_id);
      const Name = `${firstname} ${lastname}`;
      const status = read_status;
      const msgObj = {
        Name, message_id, subject, message, status, datestr,
      };
      inboxhtml.innerHTML += messagepanel(msgObj);
    });
  }
  if (responseObj.status === 'Empty') {
    if (type === 'read') readLabel.textContent = `Read(${0})`;
    else if (type === 'unread') unreadLabel.textContent = `Unread(${0})`;
    else inboxNum.setAttribute('box', 0);
    inboxhtml.innerHTML += emptyMsgBox(empty);
  }
};


const populateOutbox = async (type) => {
  const boxhtml = document.querySelector(`.${type}`);
  const boxNum = document.querySelector(`#${type}button`);
  const url = (type === 'sent') ? `${appurl}messages/sent` : `${appurl}messages/draft`;
  const { responseObj } = await fetchCall(url, 'GET');
  if (responseObj.status === 'Successful') {
    const { data } = responseObj;
    boxNum.setAttribute('box', data.length);
    boxhtml.innerHTML = '';
    data.forEach(async (rMessage) => {
      const {
        message_id, subject, message, status, created_on,
      } = rMessage;
      const datestr = getDateStr(created_on);
      const { firstname, lastname } = await getUser(rMessage.receiver_id);
      const Name = `${firstname} ${lastname}`;
      const msgObj = {
        Name, message_id, subject, message, status, datestr,
      };
      boxhtml.innerHTML += messagepanel(msgObj);
    });
  }
  if (responseObj.status === 'Empty') {
    boxNum.setAttribute('box', 0);
    boxhtml.innerHTML = emptyMsgBox(`${type} box is empty`);
  }
};

const populateView = async (msgId) => {
  const url = `${appurl}messages/${msgId}`;

  const { responseObj } = await fetchCall(url, 'GET');
  view.innerHTML = ' ';
  if (responseObj.status === 'Successful') {
    const { data } = responseObj;
    const {
      message_id, subject, message, created_on, sender_id, user_id,
    } = data;
    const datestr = getDateStr(created_on);
    const sender = await getUser(sender_id);
    const receiver = await getUser(user_id);
    const senderName = (thisUser.email === sender.email) ? 'You' : `${sender.firstname} ${sender.lastname}`;
    const receiverName = (thisUser.email === receiver.email) ? 'You' : `${receiver.firstname} ${receiver.lastname}`;
    const profileImg = (thisUser.email === sender.email) ? receiver.profile_pic : sender.profile_pic;
    const msgObj = {
      senderName, receiverName, message_id, subject, message, profileImg, datestr,
    };
    view.innerHTML += messageView(msgObj);
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
