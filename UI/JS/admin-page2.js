const hideCompose = document.querySelector('.cutmsg');
const newGroup = document.querySelector('.creategrp');
const inboxes = document.querySelector('.thread');
const newGroupbtn = document.querySelector('.newgrpbtn');

hideCompose.addEventListener('click', () => {
  newGroup.style.display = 'none';
  inboxes.style.display = 'block';
});

newGroupbtn.addEventListener('click', () => {
  newGroup.style.display = 'flex';
  inboxes.style.display = 'none';
  inboxCard('hide');
});