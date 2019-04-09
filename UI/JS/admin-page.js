const messageContainer = document.querySelector('.msgcontain');
const hideCompose = document.querySelector('.cutmsg');
const newMsg = document.querySelector('.composewrapper');
const newGroup = document.querySelector('.Groupwrap');
const inboxes = document.querySelector('.thread');
const inboxList = document.querySelector('.inbox');
const slider = document.querySelector('.openinbox');
const navIcon = document.querySelector('.menu');
const menuList = document.querySelector('.navmenu');
const modal = document.querySelector('.wrapper');
const composeBtns = document.querySelector('.createMessage');
const createGroup = document.querySelector('.createGroup');
const hideGroup = document.querySelector('#hidegroup');

const inboxCard = (status) => {
  if (status === 'hide') {
    inboxList.classList.remove('open');
    modal.classList.remove('modal');
  } else {
    inboxList.classList.add('open');
    modal.classList.add('modal');
  }
};

composeBtns.addEventListener('click', () => {
  newMsg.style.display = 'block';
  inboxes.style.display = 'none';
  newGroup.style.display = 'none';
  inboxCard('hide');
});

createGroup.addEventListener('click', () => {
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

slider.addEventListener('click', (event) => {
  let status = event.target.id;

  if (status === 'close') {
    inboxCard('show');
    status = 'open';
  } else {
    inboxCard('hide');
    status = 'close';
  }
});

modal.addEventListener('click', (event) => {
  let { target } = event;
  do {
    if (target.classList[0] === 'wrapmsghead') break;
    if (target.id === 'inbox') return;
    target = target.parentNode;
  } while (target);
  inboxCard('hide');
});

navIcon.addEventListener('click', (event) => {
  let status = event.target.id;

  if (status === 'navhide') {
    menuList.style.transform = 'scale(1)';
    status = 'navshow';
  } else {
    menuList.style.transform = 'scale(0)';
    status = 'navhide';
  }
});
