/* eslint-disable camelcase */
/* eslint-disable no-undef */
const createMsg = document.querySelector('#newMessage');
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
  const profileimg = document.querySelector('.profileimg');
  const {
    firstname, lastname, email, profile_pic,
  } = thisUser;
  profilename.textContent = `${firstname} ${lastname}`;
  senderemail.textContent = email;
  profileimg.src = profile_pic;
  await populateInbox();
  await populateOutbox('sent');
  await populateOutbox('draft');
};

window.addEventListener('load', async () => {
  await loadUserInfo();
});

const getMsgInfo = () => {
  const receiverEmail = document.querySelector('#receiverEmail').value.trim();
  const message = document.querySelector('#composemessage').value.trim();
  const subject = document.querySelector('#composesubject').value.trim();
  const status = 'sent';
  const obj = {
    receiverEmail, message, subject, status,
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

refresh.addEventListener('click', async () => {
  addClass(refresh, 'refreshing');
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

messageContainer.addEventListener('click', async (event) => {
  const thisElement = event.target;
  const thisMsg = thisElement.parentElement;
  const thisMsgId = thisMsg.id;
  const thisElementId = thisMsg.id;
  if (thisMsg.classList[0] === 'wrapmsghead') {
    const msgId = thisMsgId.slice(0, thisMsgId.indexOf('_'));
    addClass(view, 'loader');
    await populateView(msgId);
    removeClass(view, 'loader');
  }
});
