/* eslint-disable no-undef */
/* eslint-disable camelcase */
const edit = document.querySelectorAll('.edit');
const forms = document.querySelector('.wrapper');
const firstnameInput = document.querySelector('#firstname');
const name = document.querySelector('.username');
const lastnameInput = document.querySelector('#lastname');
const phoneInput = document.querySelector('#mobileNo');
const altEmailInput = document.querySelector('#alternativeEmail');
const profilePic = document.querySelector('.profilepic');
const imageInput = document.querySelector('#upload');
const uploadBtn = document.querySelector('.addphoto');
const saveImg = document.querySelector('.saveimg');
const saved = document.querySelector('.saved');
const loaddiv = document.querySelector('.load');
let pictureFile = null;

const loadUserInfo = async () => {
  const thisUser = await getUser();
  console.log(thisUser)
  const {
    firstname, lastname, profile_pic, mobile_no, alt_email,
  } = thisUser;
  firstnameInput.value = firstname;
  lastnameInput.value = lastname;
  name.textContent = `${firstname} ${lastname}`;
  phoneInput.value = mobile_no;
  altEmailInput.value = alt_email;
  profilePic.src = profile_pic;
};

window.addEventListener('load', async () => {
  addClass(forms, 'loader');
  await loadUserInfo();
  removeClass(forms, 'loader');
});

const getImglink = async (imageFile) => {
  const imgForm = new FormData();
  imgForm.append('image', imageFile);
  imgForm.append('name', imageFile.name);
  const dataform = {
    method: 'POST',
    headers: new Headers({
      Authorization: 'Client-ID 163ceaad1d6ed26',
    }),
    body: imgForm,
  };
  const imgurApiUrl = 'https://api.imgur.com/3/image';

  try {
    const response = await fetch(imgurApiUrl, dataform);
    const result = await response.json();
    const imgUrl = result.data.link;
    const { statusCode } = await fetchCall(`${appurl}user/update`, 'PUT', { profilePic: imgUrl });
    if (statusCode !== 200) throw new Error('error updating image');
    removeClass(saved, 'hide');
    saved.textContent = 'Saved';
    profilePic.src = imgUrl;
  } catch (err) {
    removeClass(saved, 'hide');
    saved.textContent = 'Error while saving. Try again';
  } finally {
    removeClass(loaddiv, 'loader');
    removeClass(uploadBtn, 'hide');
  }
};

const loadFilePath = (file) => {
  const readPath = new FileReader();
  readPath.readAsDataURL(file);
  readPath.addEventListener('load', (event) => {
    const path = event.target.result;
    profilePic.src = path;
    removeClass(saveImg, 'hide');
  });
};

uploadBtn.addEventListener('click', () => {
  saved.textContent = ' ';
  addClass(saved, 'hide');
});

imageInput.addEventListener('change', () => {
  [pictureFile] = imageInput.files;
  loadFilePath(pictureFile);
});

saveImg.addEventListener('click', async () => {
  addClass(uploadBtn, 'hide');
  addClass(loaddiv, 'loader');
  addClass(saveImg, 'hide');
  await getImglink(pictureFile);
});


edit.forEach((editIcon) => {
  editIcon.addEventListener('click', () => {
    const thisInput = editIcon.previousElementSibling;
    const savebtn = editIcon.nextElementSibling;
    thisInput.disabled = false;
    thisInput.focus();
    addClass(editIcon, 'hide');
    removeClass(savebtn, 'hide');
  });
});

forms.addEventListener('submit', async (event) => {
  event.preventDefault();
  const thisform = event.target;
  const input = thisform.querySelector('input');
  const editIcon = thisform.querySelector('.edit');
  const savebtn = thisform.querySelector('button');
  removeClass(editIcon, 'hide');
  addClass(savebtn, 'hide');
  const url = `${appurl}user/update`;
  const inputName = input.id;
  const value = input.value.trim();
  const detail = {};
  detail[inputName] = value;
  addClass(thisform, 'loader');
  const { responseObj, statusCode } = await fetchCall(url, 'PUT', detail);
  console.log(responseObj);
  if (statusCode === 200) {
    loadUserInfo();
  } else {
    console.log('bad request');
  }
  removeClass(thisform, 'loader');
});
