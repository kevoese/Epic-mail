/* eslint-disable no-undef */
const container = document.querySelector('.container');
const buttons = document.querySelectorAll('button');

const getLoginInfo = () => {
  const email = document.querySelector('.email').value.trim();
  const password = document.querySelector('.password').value.trim();
  const obj = { email, password };
  return obj;
};

const getSignUpInfo = () => {
  const email = document.querySelector('.emailR').value.trim();
  const password = document.querySelector('.passwordR').value;
  const firstname = document.querySelector('.firstname').value.trim();
  const lastname = document.querySelector('.lastname').value.trim();
  const obj = {
    firstname, lastname, email, password,
  };
  return obj;
};

container.addEventListener('submit', async (event) => {
  let details;
  event.preventDefault();
  const thisForm = event.target;
  const thisFormId = thisForm.id;
  if (thisFormId === 'loginform') details = getLoginInfo();
  else details = getSignUpInfo();
  const url = (thisFormId === 'loginform') ? `${appurl}auth/login` : `${appurl}auth/signup`;
  thisForm.classList.add('loader');
  const error = thisForm.querySelector('.invalid');
  buttons.forEach(button => hide(button));
  const { responseObj, statusCode } = await fetchCall(url, 'POST', details);
  thisForm.classList.remove('loader');
  if (statusCode === 200 || statusCode === 201) {
    const { Token } = responseObj.data;
    localStorage.setItem('token', Token);
  } else if (statusCode === 400) {
    unhide(error);
  } else if (statusCode === 409) {
    unhide(error);
    const email = thisForm.querySelector('.emailicon');
    email.classList.add('wrongemail');
  }
});
