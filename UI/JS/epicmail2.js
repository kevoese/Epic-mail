/* eslint-disable no-undef */
window.addEventListener('load', async () => {
  if (localStorage.token) window.location.replace(`${website}/main.html`);
});

const viewWrapper = document.querySelector('.wrapper');

viewWrapper.addEventListener('click', () => {
  const myforms = viewWrapper.querySelectorAll('div');
  myforms.forEach((form) => {
    removeClass(form, 'errorResponse');
    removeClass(form, 'successmsg');
  });
});

loadUserInfo = async () => {
  await fetchCall(appurl, 'GET');
};

const main = document.querySelector('main');
const buttons = document.querySelectorAll('button');
const resetContain = document.querySelector('.resetContain');
const resetPasswordForm = document.querySelector('#resetPasswordForm');
const resetMethodForm = document.querySelector('#resetMethodForm');
const recoveryEmail = document.querySelector('.resetEmail');
let thisUser;

const getLoginInfo = () => {
  const email = document.querySelector('.email').value.trim();
  const password = document.querySelector('.password').value.trim();
  const obj = { email, password };
  return obj;
};

const getSignUpInfo = () => {
  const username = document.querySelector('.usernameR').value.trim();
  const email = `${username}@epicmail.com`;
  const alternativeEmail = document.querySelector('.emailR').value.trim();
  const password = document.querySelector('.passwordR').value;
  const firstname = document.querySelector('.firstname').value.trim();
  const lastname = document.querySelector('.lastname').value.trim();
  const obj = {
    firstname, lastname, email, password, alternativeEmail,
  };
  return obj;
};

main.addEventListener('submit', async (event) => {
  let details;
  event.preventDefault();
  const thisForm = event.target;
  const thisFormId = thisForm.id;
  if (thisFormId === 'loginform') details = getLoginInfo();
  else details = getSignUpInfo();
  const url = (thisFormId === 'loginform') ? `${appurl}auth/login` : `${appurl}auth/signup`;
  const webpage = (thisFormId === 'loginform') ? `${website}/main.html` : `${website}/uploadProfile.html`;
  thisForm.classList.add('loader');
  const error = thisForm.querySelector('.invalid');
  buttons.forEach(button => hide(button));
  const { responseObj, statusCode } = await fetchCall(url, 'POST', details);
  thisForm.classList.remove('loader');
  if (statusCode === 200 || statusCode === 201) {
    const { Token } = responseObj.data;
    localStorage.setItem('token', Token);
    window.location.replace(webpage);
  } else if (statusCode === 400) {
    unhide(error);
  } else if (statusCode === 409) {
    unhide(error);
    const username = thisForm.querySelector('.username');
    username.classList.add('wrongemail');
  }
});

const resetPasswordInput = document.querySelector('#resetPassword');
const newPasswordInput = document.querySelector('#newPassword');
const confirmPasswordInput = document.querySelector('#confirmPassword');
const resetUsername = document.querySelector('.resetUsername');

resetContain.addEventListener('submit', async (event) => {
  event.preventDefault();
  const thisForm = event.target;
  const thisFormId = thisForm.id;
  if (thisFormId === 'resetUsernameForm') {
    const email = `${resetUsername.value.trim()}@epicmail.com`;
    const url = `${appurl}reset/${email}`;
    addClass(resetContain, 'refreshing');
    const { responseObj, statusCode } = await fetchCall(url, 'GET');
    removeClass(resetContain, 'refreshing');
    if (statusCode === 200) {
      thisUser = responseObj.data;
      addClass(thisForm, 'hideElement');
      recoveryEmail.textContent = thisUser.alt_email;
      removeClass(resetMethodForm, 'hideElement');
    } else if (statusCode === 400) {
      errorResponse(resetContain, 'Bad Request');
    } else if (statusCode === 404) {
      errorResponse(resetContain, 'Email does not exist');
    }
  }
  if (thisFormId === 'resetPasswordForm') {
    const newPassword = newPasswordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();
    const oldPassword = resetPasswordInput.value.trim();
    const { email } = thisUser;
    if (confirmPassword === newPassword) {
      const details = {
        email, newPassword, oldPassword,
      };
      const url = `${appurl}update/password`;
      addClass(resetContain, 'refreshing');
      const { statusCode, responseObj } = await fetchCall(url, 'PUT', details);
      removeClass(resetContain, 'refreshing');
      if (statusCode === 200) {
        const { Token } = responseObj.data;
        localStorage.setItem('token', Token);
        window.location.replace(`${website}/main.html`);
      } else errorResponse(resetContain, '!Invalid Password. Try again');
    } else errorResponse(resetContain, '! Password does not match');
  }
  if (thisFormId === 'resetMethodForm') {
    const url = `${appurl}resetMailer/${thisUser.id}`;
    addClass(resetContain, 'refreshing');
    const { statusCode } = await fetchCall(url, 'GET');
    removeClass(resetContain, 'refreshing');
    if (statusCode === 200) {
      addClass(thisForm, 'hideElement');
      removeClass(resetPasswordForm, 'hideElement');
    } else errorResponse(resetContain, '! Password reset was unsuccessful');
  }
});
