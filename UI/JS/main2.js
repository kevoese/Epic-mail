/* eslint-disable camelcase */
/* eslint-disable no-undef */
const createMsg = document.querySelector('#newMessage');
const createMsgGrp = document.querySelector('#groupform');
const viewWrapper = document.querySelector('.chats');
const wrapper = document.querySelector('.wrapper');
const inputs = viewWrapper.querySelectorAll('input');
const refresh = document.querySelector('.refresh');
const refreshGrp = document.querySelector('.refreshGrp');
const myinbox = document.querySelector('.all');
const inboxbtn = document.querySelector('#radioall');
const signout = document.querySelector('.signout');
const newmsgEmailInput = document.querySelector('#receiverEmail');
const newmsgTextInput = document.querySelector('#composemessage');
const newmsgSubjectInput = document.querySelector('#composesubject');
let thisUser;

loadUserInfo = async () => {
  thisUser = await getUser();
  const profilename = document.querySelector('.profilename');
  const senderemail = document.querySelector('.composesender');
  const senderemailGrp = Groupwrap.querySelector('.composesender');
  const profileimg = document.querySelector('.profileimg');
  const {
    firstname, lastname, email, profile_pic,
  } = thisUser;
  profilename.textContent = `${firstname} ${lastname}`;
  senderemail.textContent = email;
  senderemailGrp.textContent = email;
  profileimg.src = profile_pic;
  await populateInbox('unread');
  await populateInbox('read');
  await populateInbox();
  await populateOutbox('sent');
  await populateOutbox('draft');
  await populateGrpContact();
  await populateContacts();
};

window.addEventListener('load', async () => {
  addClass(wrapper, 'loader');
  await loadUserInfo();
  removeClass(wrapper, 'loader');
});

const getMsgInfo = (pMsgId = false) => {
  const receiverEmail = newmsgEmailInput.value.trim();
  const message = newmsgTextInput.value.trim();
  const subject = newmsgSubjectInput.value.trim();
  const savedraft = document.querySelector('#insavedraft').checked;
  const status = (savedraft) ? 'draft' : 'sent';
  const obj = {
    receiverEmail, message, subject, status,
  };
  if (pMsgId) obj.parentMessageId = pMsgId;
  return obj;
};

const getGrpMsgInfo = () => {
  const groups = Groupwrap.querySelector('#grpcontacts');
  const index = groups.selectedIndex;
  if (index === 0) {
    return false;
  }
  const { id } = groups.children[index];
  const message = Groupwrap.querySelector('#composemessagegrp').value.trim();
  const subject = Groupwrap.querySelector('#composesubjectgrp').value.trim();
  const savedraft = document.querySelector('#insavedraftgrp').checked;
  const status = (savedraft) ? 'draft' : 'sent';
  const obj = {
    id, message, subject, status,
  };
  return obj;
};

inputs.forEach((input) => {
  input.addEventListener('keyup', (event) => {
    const thisInput = event.target;
    removeClass(thisInput, 'wrongemail');
  });
});

viewWrapper.addEventListener('click', (event) => {
  const buttons = viewWrapper.querySelectorAll('button');
  buttons.forEach(button => unhide(button));
  const myforms = viewWrapper.querySelectorAll('form');
  myforms.forEach((form) => {
    removeClass(form, 'errorResponse');
    removeClass(form, 'successmsg');
    removeClass(form, 'parentmsgErr');
  });

  if (event.target.id === 'replybtn') {
    composeNewMsg();
    const msgBody = event.target.parentElement;
    const raw = msgBody.querySelector('.sEmail').textContent.trim();
    const copysubject = msgBody.querySelector('.subject').textContent.trim();
    const email = raw.slice(2, -2);
    newmsgEmailInput.value = email;
    newmsgSubjectInput.value = `Reply: ${copysubject}`;
    reply_stat = true;
    parentMsgId = msgBody.id.slice(0, msgBody.id.indexOf('_'));
  }

  if (event.target.id === 'fwdbtn') {
    composeNewMsg();
    const msgBody = event.target.parentElement;
    const copytext = msgBody.querySelector('.msgP').textContent.trim();
    const copysubject = msgBody.querySelector('.subject').textContent.trim();
    newmsgTextInput.value = copytext;
    newmsgSubjectInput.value = `Forward: ${copysubject}`;
  }

  if (event.target.id === 'draftbtn') {
    composeNewMsg();
    const msgBody = event.target.parentElement;
    const copytext = msgBody.querySelector('.msgP').textContent.trim();
    const copysubject = msgBody.querySelector('.subject').textContent.trim();
    const raw = msgBody.querySelector('.rEmail').textContent.trim();
    const email = raw.slice(2, -2);
    newmsgEmailInput.value = email;
    newmsgTextInput.value = copytext;
    newmsgSubjectInput.value = copysubject;
  }

  if (checkclass(event.target, 'viewthread')) {
    const raw = event.target.id;
    const threadId = raw.slice(0, raw.indexOf('_'));
    populateThread(threadId);
  }
});

createMsg.addEventListener('submit', async (event) => {
  event.preventDefault();
  const thisForm = event.target;
  const details = (reply_stat) ? getMsgInfo(parentMsgId) : getMsgInfo();
  reply_stat = false;
  parentMsgId = null;
  const url = `${appurl}messages`;
  const buttons = thisForm.querySelectorAll('button');
  addClass(thisForm, 'loader');
  buttons.forEach(button => hide(button));
  const { statusCode } = await fetchCall(url, 'POST', details);
  if (statusCode === 200) {
    await populateOutbox('sent');
    await populateOutbox('draft');
    await populateContacts();
    addClass(thisForm, 'successmsg');
    thisForm.reset();
  } else if (statusCode === 404) {
    errorResponse(thisForm, 'Email does not exist');
    const email = thisForm.querySelector('#receiverEmail');
    addClass(email, 'wrongemail');
  } else if (statusCode === 400) {
    errorResponse(thisForm, 'message you are replying to does not exist');
  }
  removeClass(thisForm, 'loader');
});

contacts.addEventListener('change', () => {
  newmsgEmailInput.value = contacts.value;
});

createMsgGrp.addEventListener('submit', async (event) => {
  event.preventDefault();
  const thisForm = event.target;
  const details = getGrpMsgInfo();
  if (details) {
    const url = `${appurl}groups/${details.id}/messages`;
    const buttons = thisForm.querySelectorAll('button');
    addClass(thisForm, 'loader');
    buttons.forEach(button => hide(button));
    const { responseObj, statusCode } = await fetchCall(url, 'POST', details);
    if (statusCode === 200) {
      await populateOutbox('sent');
      await populateOutbox('draft');
      await populateInbox('unread');
      await populateInbox();
      addClass(thisForm, 'successmsg');
      thisForm.reset();
    } else if (statusCode === 400 && responseObj.error === 'Bad request') {
      errorResponse(thisForm, 'Invalid Request');
      const grpselect = thisForm.querySelector('#grpcontacts');
      addClass(grpselect, 'wrongemail');
    } else if (statusCode === 400 && responseObj.error === 'invalid parent message') {
      errorResponse(thisForm, 'Message does not exist');
    }
    removeClass(thisForm, 'loader');
  } else errorResponse(thisForm, 'Please select a group');
});

refresh.addEventListener('click', async () => {
  addClass(refresh, 'refreshing');
  await populateInbox('read');
  await populateInbox('unread');
  await populateInbox();
  await populateOutbox('sent');
  await populateOutbox('draft');
  removeClass(refresh, 'refreshing');
});

refreshGrp.addEventListener('click', async () => {
  addClass(refreshGrp, 'refreshing');
  await populateGrpContact();
  removeClass(refreshGrp, 'refreshing');
});

checkbox.addEventListener('click', async (event) => {
  const btn = event.target;
  const btntype = btn.id;
  inboxbtn.checked = true;
  if (btntype === 'incheckbox0') {
    if (btn.checked) {
      addClass(myinbox, 'loader');
      await populateInbox();
      removeClass(myinbox, 'loader');
    }
  }
  if (btntype === 'incheckbox1') {
    if (btn.checked) {
      addClass(myinbox, 'loader');
      await populateInbox('unread');
      removeClass(myinbox, 'loader');
    }
  }
  if (btntype === 'incheckbox2') {
    if (btn.checked) {
      addClass(myinbox, 'loader');
      await populateInbox('read');
      removeClass(myinbox, 'loader');
    }
  }
});

let deleteMsgId;
const deleteresponse = document.querySelector('.deleteresponse');
const closeDeleteErr = document.querySelector('#closeDeleteErr');

messageContainer.addEventListener('click', async (event) => {
  const thisElement = event.target;
  const thisMsg = thisElement.parentElement;
  const thisMsgId = thisMsg.id;
  if (thisMsg.classList[0] === 'wrapmsghead') {
    const allmsgs = document.querySelectorAll('.wrapmsghead');
    const msgId = thisMsgId.slice(0, thisMsgId.indexOf('_'));
    addClass(view, 'loader');
    await populateView(msgId);
    removeClass(thisMsg, 'unreadmsg');
    addClass(thisMsg, 'readmsg');
    removeClass(view, 'loader');
    allmsgs.forEach((element) => {
      if (checkclass(element, 'currentmsg')) removeClass(element, 'currentmsg');
    });
    addClass(thisMsg, 'currentmsg');
    await populateInbox('unread');
  }

  if (thisMsg.classList[0] === 'deletediv') {
    const deleteMsg = thisMsg.parentElement;
    deleteMsgId = deleteMsg.id;
    deleteModal.showModal();
  }
});

deleteModal.addEventListener('click', async (event) => {
  const element = document.getElementById(deleteMsgId);
  const btnTypeId = event.target.id;
  if (btnTypeId === 'closebox' || btnTypeId === 'cancel') deleteModal.close();
  else if (btnTypeId === 'yes') {
    deleteModal.close();
    addClass(element, 'deleteAni');
    setTimeout(() => {
      element.parentNode.removeChild(element);
    }, 600);
    const msgId = deleteMsgId.slice(0, deleteMsgId.indexOf('_'));
    const result = await deleteMsgEndpoint(msgId);
    if (!result) deleteresponse.showModal();
  }
});

closeDeleteErr.addEventListener('click', () => deleteresponse.close());

signout.addEventListener('click', () => {
  localStorage.removeItem('token');
  window.location.replace(`${website}/epic-mail.html`);
});
