const imageInput = document.querySelector('.createimgfile');
const skipbtn = document.querySelector('#skip');
const savebtn = document.querySelector('#save');
const saved = document.querySelector('.saved');
const profileImage = document.querySelector('.profilepic');
const imageInputBtn = document.querySelector('.changepic');
const loading = document.querySelector('.loading');
const errormsg = document.querySelector('.error');
let pictureFile = null;


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
    loading.classList.add('hide');
    saved.style.transform = 'translateX(-50%) scale(1)';
    profileImage.src = imgUrl;
    skipbtn.classList.remove('hide');
    skipbtn.textContent = 'Go';
  } catch (err) {
    loading.classList.add('hide');
    errormsg.classList.remove('hide');
  }
};

const loadFilePath = (file) => {
  const readPath = new FileReader();
  readPath.readAsDataURL(file);
  readPath.addEventListener('load', (event) => {
    const path = event.target.result;
    profileImage.src = path;
    skipbtn.classList.add('hide');
    savebtn.classList.remove('hide');
  });
};

imageInput.addEventListener('change', () => {
  [pictureFile] = imageInput.files;
  loadFilePath(pictureFile);
});

savebtn.addEventListener('click', () => {
  savebtn.classList.add('hide');
  loading.classList.remove('hide');
  errormsg.classList.add('hide');
  getImglink(pictureFile);
  imageInputBtn.style.transform = 'translateX(-50%) scale(0)';
});
