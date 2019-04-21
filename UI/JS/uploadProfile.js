/* eslint-disable no-undef */
const imageInput = document.querySelector('.createimgfile');
const skipbtn = document.querySelector('#skip');
const savebtn = document.querySelector('#save');
const saved = document.querySelector('.saved');
const profileImage = document.querySelector('.profilepic');
const imageInputBtn = document.querySelector('.changepic');
const loading = document.querySelector('.loading');
const container = document.querySelector('.container');
const wrapper = document.querySelector('.wrapper');
const errormsg = document.querySelector('.error');
let pictureFile = null;

loadUserInfo = async () => {
  const thisUser = await getUser();
  const { firstname, lastname } = thisUser;
  const name = `${firstname} ${lastname}`;
  container.setAttribute('message', `Welcome to Epic Mail ${name}`);
};

window.addEventListener('load', async () => {
  addClass(wrapper, 'loader');
  await getUser();
  loadUserInfo();
  removeClass(wrapper, 'loader');
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
    addClass(loading, 'hide');
    removeClass(skipbtn, 'hide');
    if (statusCode !== 200) throw new Error('error updating image');
    removeClass(saved, 'hideElement');
    profileImage.src = imgUrl;
    skipbtn.textContent = 'Go';
  } catch (err) {
    addClass(loading, 'hide');
    removeClass(skipbtn, 'hide');
    removeClass(errormsg, 'hide');
  }
};

const loadFilePath = (file) => {
  const readPath = new FileReader();
  readPath.readAsDataURL(file);
  readPath.addEventListener('load', (event) => {
    const path = event.target.result;
    profileImage.src = path;
    addClass(skipbtn, 'hide');
    removeClass(savebtn, 'hide');
  });
};

imageInput.addEventListener('change', () => {
  [pictureFile] = imageInput.files;
  loadFilePath(pictureFile);
});

savebtn.addEventListener('click', async () => {
  addClass(savebtn, 'hide');
  removeClass(loading, 'hide');
  addClass(errormsg, 'hide');
  addClass(imageInputBtn, 'hideElement');
  await getImglink(pictureFile);
});

container.addEventListener('click', () => {
  if (!checkclass(errormsg, 'hide')) {
    profileImage.src = 'images/userprofile.png';
    addClass(errormsg, 'hide');
    removeClass(imageInputBtn, 'hideElement');
  }
});
