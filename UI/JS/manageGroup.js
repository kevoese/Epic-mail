/* eslint-disable no-undef */
/* eslint-disable camelcase */
const newGrpform = document.querySelector('.newgroupform');
const grpname = document.querySelector('.nameofnewgrp');
const newNameInput = document.querySelector('.newName');
const updateNewName = document.querySelector('.updategrpname');
const refresh = document.querySelector('.refresh');
const wrapper = document.querySelector('.wrapper');

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
  addClass(wrapper, 'loader');
  await loadUserInfo();
  await populateGroups();
  removeClass(wrapper, 'loader');
});

document.addEventListener('click', () => {
  const inputs = document.querySelectorAll('input');
  inputs.forEach((input) => {
    input.addEventListener('focus', (event) => {
      const thisInput = event.target;
      const thisForm = thisInput.parentElement;
      const parentDiv = thisForm.parentElement;
      const buttons = thisForm.parentElement.querySelectorAll('button');
      if (checkclass(thisInput, 'wrongemail')) removeClass(thisInput, 'wrongemail');
      if (checkclass(buttons[0], 'hideElement')) {
        buttons.forEach(button => unhide(button));
      }
      if (checkclass(thisForm, 'errorResponse')) removeClass(thisForm, 'errorResponse');
      if (checkclass(thisForm, 'successResponse')) removeClass(thisForm, 'successResponse');
      if (checkclass(parentDiv, 'errorResponse')) removeClass(parentDiv, 'errorResponse');
      if (checkclass(parentDiv, 'successResponse')) removeClass(parentDiv, 'successResponse');
    });
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
  if (statusCode === 200) {
    await populateGroups();
    successResponse(thisForm, 'New group Created successfully');
    thisForm.reset();
  } else if (statusCode === 409) {
    errorResponse(thisForm, 'Group with this name already exist');
    addClass(grpname, 'wrongemail');
  }
  removeClass(thisForm, 'loader');
});

refresh.addEventListener('click', async () => {
  addClass(refresh, 'refreshing');
  await populateGroups();
  removeClass(refresh, 'refreshing');
});


groupwrap.addEventListener('click', async (event) => {
  if (event.target.classList.contains('edit')) {
    const thisGroup = event.target.parentElement;
    const thisGroupId = thisGroup.id;
    newGroup.style.display = 'none';
    inboxes.style.display = 'none';
    inboxCard('hide');
    const groupId = thisGroupId.slice(0, thisGroupId.indexOf('_'));
    populateEditform(groupId);
    editGroup.style.display = 'flex';
  }
});


editGroup.addEventListener('click', (event) => {
  const { target } = event;
  const targetId = target.id;
  if (targetId === 'cutmsgedit') {
    editGroup.style.display = 'none';
    inboxes.style.display = 'block';
  }
});

editGroup.addEventListener('submit', async (event) => {
  event.preventDefault();
  const { target } = event;
  const targetId = target.id;
  const Formwrapper = target.parentElement;
  if (checkclass(target, 'addUserForm')) {
    const id = targetId.slice(0, targetId.indexOf('_'));
    const userEmail = document.querySelector('#newUserEmail');
    const email = userEmail.value.trim();
    addClass(target, 'loader');
    const { statusCode } = await fetchCall(`${appurl}groups/${id}/users`, 'POST', { email });
    if (statusCode === 200) {
      await populateEditform(id);
      await populateGroups();
      successResponse(Formwrapper, 'User added successfully');
      target.reset();
    } else if (statusCode === 404) {
      errorResponse(Formwrapper, 'Email does not exist');
      addClass(userEmail, 'wrongemail');
    } else if (statusCode === 400) {
      errorResponse(Formwrapper, 'You are already a member');
      addClass(userEmail, 'wrongemail');
    } else if (statusCode === 409) {
      errorResponse(Formwrapper, 'User is already a member of this group');
      addClass(userEmail, 'wrongemail');
    }
    removeClass(target, 'loader');
  }
  if (checkclass(target, 'addContacts')) {

  }
  if (checkclass(target, 'changegroupname')) {

  }

});
