/* eslint-disable no-undef */
/* eslint-disable camelcase */
const newGrpform = document.querySelector('.newgroupform');
const grpname = document.querySelector('.nameofnewgrp');
const inputs = document.querySelectorAll('input');
let thisUser;

const loadUserInfo = async () => {
  thisUser = await getUser();
  const profilename = document.querySelector('.profilename');
  const profileimg = document.querySelector('.profileimg');
  const {
    firstname, lastname, profile_pic,
  } = thisUser;
  profilename.textContent = `${firstname} ${lastname}`;
  profileimg.src = profile_pic;
};

window.addEventListener('load', async () => {
  await loadUserInfo();
  await populateGroups();
});

inputs.forEach((input) => {
  input.addEventListener('keyup', (event) => {
    const thisInput = event.target;
    const thisForm = thisInput.parentElement;
    const buttons = thisForm.parentElement.querySelectorAll('button');
    if (checkclass(thisInput, 'wrongemail')) removeClass(thisInput, 'wrongemail');
    if (checkclass(buttons[0], 'hideElement')) {
      buttons.forEach(button => unhide(button));
      if (checkclass(thisForm, 'grpnameErr')) removeClass(thisForm, 'grpnameErr');
      if (checkclass(thisForm, 'successgrpmsg')) removeClass(thisForm, 'successgrpmsg');
    }
  });
});

newGrpform.addEventListener('submit', async (event) => {
  event.preventDefault();
  const name = grpname.value.trim();
  const thisForm = event.target;
  const url = `${appurl}groups`;
  const buttons = thisForm.querySelectorAll('button');
  addClass(thisForm, 'loader');
  buttons.forEach(button => hide(button));
  const { statusCode } = await fetchCall(url, 'POST', { name });
  removeClass(thisForm, 'loader');
  if (statusCode === 200) {
    addClass(thisForm, 'successgrpmsg');
    thisForm.reset();
  } else if (statusCode === 409) {
    addClass(thisForm, 'grpnameErr');
    addClass(grpname, 'wrongemail');
  }
});

refresh.addEventListener('click', async () => {
  addClass(refresh, 'refreshing');
  await populateGroups();
  removeClass(refresh, 'refreshing');
});
