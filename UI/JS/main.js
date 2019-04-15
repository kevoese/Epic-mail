/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const messageBtns = document.querySelector('.msgbuttons');
const checkbox = document.querySelector('.checkbox');
const view = document.querySelector('.chatcontent');
const deleteModal = document.querySelector('.sureDelete');
const Groupwrap = document.querySelector('.Groupwrap');
const addGrpContact = Groupwrap.querySelector('.addContacts');
const composeBtns = document.querySelector('.composeNewMsg');
const createGroup = document.querySelector('.composeNewGrpMsg');
const hideGroup = document.querySelector('#hidegroup');
const messageContainer = document.querySelector('.msgcontain');
const hideCompose = document.querySelector('.cutmsg');
const newMsg = document.querySelector('.composewrapper');
const newGroup = document.querySelector('.Groupwrap');
const inboxes = document.querySelector('.thread');
const plus = document.querySelector('.plus');
const plusbtns = document.querySelector('.plusbtns');

const composeNewMsg = () => {
  addClass(plusbtns, 'hideplusbtns');
  newMsg.style.display = 'block';
  inboxes.style.display = 'none';
  newGroup.style.display = 'none';
  inboxCard('hide');
};

plus.addEventListener('click', () => {
  if (checkclass(plusbtns, 'hideplusbtns')) removeClass(plusbtns, 'hideplusbtns');
  else addClass(plusbtns, 'hideplusbtns');
});

composeBtns.addEventListener('click', () => {
  composeNewMsg();
});

createGroup.addEventListener('click', () => {
  addClass(plusbtns, 'hideplusbtns');
  newMsg.style.display = 'none';
  newGroup.style.display = 'block';
  inboxes.style.display = 'none';
  inboxCard('hide');
});

hideCompose.addEventListener('click', () => {
  newMsg.style.display = 'none';
  inboxes.style.display = 'block';
  newGroup.style.display = 'none';
});

hideGroup.addEventListener('click', () => {
  newMsg.style.display = 'none';
  inboxes.style.display = 'block';
  newGroup.style.display = 'none';
});

messageBtns.addEventListener('click', (event) => {
  const btnType = event.target.id;
  if (btnType === 'allbutton') {
    messageContainer.style.left = '0';
    checkbox.querySelectorAll('div').forEach(element => unhide(element));
  } else if (btnType === 'sentbutton') {
    messageContainer.style.left = '-100%';
    checkbox.querySelectorAll('div').forEach(element => hide(element));
  } else if (btnType === 'draftbutton') {
    messageContainer.style.left = '-200%';
    checkbox.querySelectorAll('div').forEach(element => hide(element));
  }
});
