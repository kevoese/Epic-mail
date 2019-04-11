/* eslint-disable camelcase */
/* eslint-disable no-undef */
const createMsg = document.querySelector('#newMessage');
const createMsgGrp = document.querySelector('#groupform');
const viewWrapper = document.querySelector('.chats');
const inputs = viewWrapper.querySelectorAll('input');
const refresh = document.querySelector('.refresh');
const myinbox = document.querySelector('.all');
const inboxbtn = document.querySelector('#radioall');
let thisUser;

const loadUserInfo = async () => {
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
  await populateInbox();
  await populateOutbox('sent');
  await populateOutbox('draft');
  await populateGrpContact();
};

window.addEventListener('load', async () => {
  await loadUserInfo();
});

const getMsgInfo = () => {
  const receiverEmail = document.querySelector('#receiverEmail').value.trim();
  const message = document.querySelector('#composemessage').value.trim();
  const subject = document.querySelector('#composesubject').value.trim();
  const savedraft = document.querySelector('#insavedraft').checked;
  const status = (savedraft) ? 'draft' : 'sent';
  const obj = {
    receiverEmail, message, subject, status,
  };
  return obj;
};

const getGrpMsgInfo = () => {
  const groups = Groupwrap.querySelector('#grpcontacts');
  const index = groups.selectedIndex;
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
    const thisForm = thisInput.parentElement;
    const buttons = thisForm.parentElement.querySelectorAll('button');
    if (checkclass(thisInput, 'wrongemail')) removeClass(thisInput, 'wrongemail');
    if (checkclass(buttons[0], 'hideElement')) {
      buttons.forEach(button => unhide(button));
      if (checkclass(thisForm, 'receiverErr')) removeClass(thisForm, 'receiverErr');
      if (checkclass(thisForm, 'successmsg')) removeClass(thisForm, 'successmsg');
      if (checkclass(thisForm, 'parentmsgErr')) removeClass(thisForm, 'parentmsgErr');
    }
  });
});

createMsg.addEventListener('submit', async (event) => {
  event.preventDefault();
  const thisForm = event.target;
  const details = getMsgInfo();
  const url = `${appurl}messages`;
  const buttons = thisForm.querySelectorAll('button');
  addClass(thisForm, 'loader');
  buttons.forEach(button => hide(button));
  const { statusCode } = await fetchCall(url, 'POST', details);
  removeClass(thisForm, 'loader');
  if (statusCode === 200) {
    await populateOutbox('sent');
    await populateOutbox('draft');
    addClass(thisForm, 'successmsg');
    thisForm.reset();
  } else if (statusCode === 404) {
    addClass(thisForm, 'receiverErr');
    const email = thisForm.querySelector('#receiverEmail');
    addClass(email, 'wrongemail');
  } else if (statusCode === 400) {
    addClass(thisForm, 'parentmsgErr');
  }
});

createMsgGrp.addEventListener('submit', async (event) => {
  event.preventDefault();
  const thisForm = event.target;
  const details = getGrpMsgInfo();
  const url = `${appurl}groups/${details.id}/messages`;
  const buttons = thisForm.querySelectorAll('button');
  addClass(thisForm, 'loader');
  buttons.forEach(button => hide(button));
  const { responseObj, statusCode } = await fetchCall(url, 'POST', details);
  removeClass(thisForm, 'loader');
  if (statusCode === 200) {
    await populateOutbox('sent');
    await populateOutbox('draft');
    await populateInbox();
    addClass(thisForm, 'successmsg');
    thisForm.reset();
  } else if (statusCode === 400 && responseObj.error === 'Bad request') {
    addClass(thisForm, 'groupErr');
    const grpselect = thisForm.querySelector('#grpcontacts');
    addClass(grpselect, 'wrongemail');
  } else if (statusCode === 400 && responseObj.error === 'invalid parent message') {
    addClass(thisForm, 'parentmsgErr');
  }
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
