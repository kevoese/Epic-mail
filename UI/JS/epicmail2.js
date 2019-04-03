
const fetchCall = async (url, method, body = undefined) => {
  const object = {
    method,
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify(body),
  };
  const response = await fetch(url, object);
  const responseObj = await response.json();
  return responseObj;
};

// const login = document.querySelector('#loginform');
// const register = document.querySelector('#registerForm');


const container = document.querySelector('.container');

const getLoginInfo = () => {
  const email = document.querySelector('.email').value.trim();
  const password = document.querySelector('.password').value.trim();
  const obj = { email, password };
  return obj;
};

const getSignUpInfo = () => {
  const email = document.querySelector('.email').value.trim();
  const password = document.querySelector('.password').value;
  const firstname = document.querySelector('.email').value.trim();
  const lastname = document.querySelector('.password').value.trim();
  const obj = {
    firstname, lastname, email, password,
  };
  return obj;
};

container.addEventListener('submit', async (event) => {
  let details;
  event.preventDefault();
  const thisForm = event.target.id;
  if (thisForm === 'loginform') details = getLoginInfo();
  else details = getSignUpInfo();
  const response = await fetchCall('http://localhost:3000/api/v2/auth/login', 'POST', details);
  if (response.status === 200) {
    const { Token } = response.data;
    localStorage.setItem('token', Token);
  }
  console.log(response.status);
  event.target.reset();
});
