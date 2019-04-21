/* eslint-disable no-undef */
/* eslint-disable camelcase */
const newGrpform = document.querySelector('.newgroupform');
const grpname = document.querySelector('.nameofnewgrp');
const deleteModal = document.querySelector('.sureDelete');
const deleteresponse = document.querySelector('.deleteresponse');
const closeDeleteErr = document.querySelector('#closeDeleteErr');
const refresh = document.querySelector('.refresh');
const wrapper = document.querySelector('.wrapper');
const signout = document.querySelector('.signout');
const viewWrapper = document.querySelector('.chats');
let userDeleteId;
let userDeleteGroupId;
let deletetypeEvent;

loadUserInfo = async () => {
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

document.addEventListener('click', (thisevent) => {
  const inputs = document.querySelectorAll('input');
  inputs.forEach((input) => {
    input.addEventListener('focus', (event) => {
      const thisInput = event.target;
      removeClass(thisInput, 'wrongemail');
    });
  });

  if (thisevent.target.id === 'updategrpname') {
    const newNameInput = document.querySelector('#editgrpname');
    const saveNewName = document.querySelector('.savegrpname');
    const changeGrpName = thisevent.target;
    changeGrpName.style.display = 'none';
    saveNewName.style.display = 'initial';
    newNameInput.disabled = false;
    addClass(newNameInput, 'newNameEdit');
    newNameInput.focus();
  }
});

viewWrapper.addEventListener('click', () => {
  const buttons = viewWrapper.querySelectorAll('button');
  buttons.forEach(button => unhide(button));
  const myforms = viewWrapper.querySelectorAll('.errorCover');
  myforms.forEach((form) => {
    removeClass(form, 'errorResponse');
    removeClass(form, 'successResponse');
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
    editGroup.style.display = 'flex';
    addClass(editGroup, 'loader');
    const groupId = thisGroupId.slice(0, thisGroupId.indexOf('_'));
    await populateEditform(groupId);
    removeClass(editGroup, 'loader');
  }
});


editGroup.addEventListener('click', (event) => {
  const { target } = event;
  const targetId = target.id;
  if (targetId === 'cutmsgedit') {
    editGroup.style.display = 'none';
    inboxes.style.display = 'block';
  }
  if (checkclass(target, 'deletegrp')) {
    userDeleteGroupId = target.id.slice(0, target.id.indexOf('_'));
    deletetypeEvent = 'group';
    editGroup.style.display = 'none';
    inboxes.style.display = 'block';
    deleteModal.showModal();
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
    const memberSelect = document.querySelector('#deleteuser');
    if (memberSelect.value === 'Choose User') {
      errorResponse(Formwrapper, 'Choose a user to delete from the group');
    } else {
      const index = memberSelect.selectedIndex;
      const { id } = memberSelect.children[index];
      const groupId = targetId.slice(0, targetId.indexOf('_'));
      userDeleteId = id.slice(0, id.indexOf('_'));
      userDeleteGroupId = groupId;
      deletetypeEvent = 'user';
      deleteModal.showModal();
    }
  }
  if (checkclass(target, 'changegroupname')) {
    const newNameInput = document.querySelector('#editgrpname');
    const saveNewName = document.querySelector('.savegrpname');
    const changeNewNane = document.querySelector('.updategrpname');
    saveNewName.style.display = 'none';
    changeNewNane.style.display = 'initial';
    const name = newNameInput.value.trim();
    const id = targetId.slice(0, targetId.indexOf('_'));
    addClass(target, 'loader');
    const { statusCode } = await fetchCall(`${appurl}groups/${id}/name`, 'PATCH', { name });
    if (statusCode === 200) {
      await populateEditform(id);
      await populateGroups();
      successResponse(Formwrapper, 'Name changed successfully');
    } else if (statusCode === 400) {
      errorResponse(Formwrapper, 'Invalid Request');
    }
    removeClass(target, 'loader');
  }
});

deleteModal.addEventListener('click', async (event) => {
  const btnTypeId = event.target.id;
  if (btnTypeId === 'closebox' || btnTypeId === 'cancel') deleteModal.close();
  else if (btnTypeId === 'yes') {
    deleteModal.close();
    if (deletetypeEvent === 'user') {
      addClass(editGroup, 'loader');
      const { statusCode } = await fetchCall(`${appurl}groups/${userDeleteGroupId}/users/${userDeleteId}`, 'DELETE');
      if (statusCode === 200) {
        await populateEditform(userDeleteGroupId);
        await populateGroups();
      } else {
        deleteresponse.showModal();
      }
      removeClass(editGroup, 'loader');
    } else if (deletetypeEvent === 'group') {
      const element = document.getElementById(`${userDeleteGroupId}_small`);
      const { statusCode } = await fetchCall(`${appurl}groups/${userDeleteGroupId}`, 'DELETE');
      if (statusCode === 200) {
        inboxCard('show');
        slider.id = 'open';
        addClass(element, 'deleteAni');
        setTimeout(() => {
          groupwrap.removeChild(element);
        }, 600);
      } else {
        deleteresponse.showModal();
      }
    }
  }
});

closeDeleteErr.addEventListener('click', () => deleteresponse.close());

groupwrap.addEventListener('click', async (event) => {
  const thisElement = event.target;
  const thisMsg = thisElement.parentElement;
  const thisMsgId = thisMsg.id;
  if (checkclass(thisMsg, 'wrapmsghead')) {
    const msgId = thisMsgId.slice(0, thisMsgId.indexOf('_'));
    addClass(view, 'loader');
    await populateGroupView(msgId);
    removeClass(view, 'loader');
    const allGroups = groupwrap.querySelectorAll('.wrapmsghead');
    allGroups.forEach((element) => {
      if (checkclass(element, 'currentmsg')) removeClass(element, 'currentmsg');
    });
    addClass(thisMsg, 'currentmsg');
  }
});

signout.addEventListener('click', () => {
  localStorage.removeItem('token');
  window.location.replace(`${website}/epic-mail.html`);
});
