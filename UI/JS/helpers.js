/* eslint-disable no-unused-vars */
const { token } = localStorage;
const app = 'https://epicmailappbykelvin.herokuapp.com/api/v2/';
const applocal = 'http://localhost:3000/api/v2/';
const appurl = app;


const fetchCall = async (url, method, body = undefined) => {
  const object = {
    method,
    headers: new Headers({
      'Content-Type': 'application/json',
      token,
    }),
    body: JSON.stringify(body),
  };
  const response = await fetch(url, object);
  const statusCode = response.status;
  const responseObj = await response.json();
  //  console.log(responseObj);
  return { responseObj, statusCode };
};

const getUser = async (id = false) => {
  const url = id ? `${appurl}user/${id}` : `${appurl}user`;
  const { responseObj, statusCode } = await fetchCall(url, 'GET');
  if (statusCode === 200) {
    return responseObj.data;
  }
  return false;
};

const checkclass = (element, className) => {
  const index = element.classList.length;
  if (element.classList[index - 1] === className) return true;
  return false;
};

const addClass = (element, thisclass) => {
  element.classList.add(thisclass);
};

const removeClass = (element, thisclass) => {
  element.classList.remove(thisclass);
};

const hide = (element) => {
  element.classList.add('hideElement');
};

const unhide = (element) => {
  element.classList.remove('hideElement');
};
