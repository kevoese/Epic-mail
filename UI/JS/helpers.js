/* eslint-disable no-unused-vars */
const { token } = localStorage;
const app = 'https://epicmailappbykelvin.herokuapp.com/api/v2/';
const applocal = 'http://localhost:3000/api/v2/';
const githubPage = 'https://kevoese.github.io/Epic-mail/UI/';
const localPage = 'file:///C:/Users/Kelvin%20Esegbona/Documents/Programming/webDev/andela/bootcamper/Epic-mail/UI/';
const website = githubPage;
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
  console.log(responseObj);
  return { responseObj, statusCode };
};

const getUser = async (id = false) => {
  const url = id ? `${appurl}user/${id}` : `${appurl}user`;
  const { responseObj, statusCode } = await fetchCall(url, 'GET');
  if (statusCode === 200) {
    return responseObj.data;
  }
  window.location.replace(`${website}/epic-mail.html`);
  return false;
};

const getDateStr = (str) => {
  const end = str.indexOf('T');
  const rawDate = str.slice(0, end);
  const firstHyphen = rawDate.indexOf('-');
  const lastHyphen = rawDate.lastIndexOf('-');
  const year = rawDate.slice(0, firstHyphen);
  const month = rawDate.slice(firstHyphen + 1, lastHyphen);
  const day = rawDate.slice(lastHyphen + 1);
  const monthStrArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthStr = monthStrArr[Number(month) - 1];
  return `${monthStr} ${day} ${year}`;
};

const emptyMsgBox = message => `<p class="empty">
${message}
</p>`;

const checkclass = (element, className) => {
  if (element.classList.contains(className)) return true;
  return false;
};

const addClass = (element, thisclass) => {
  if (!checkclass(element, thisclass)) element.classList.add(thisclass);
};

const removeClass = (element, thisclass) => {
  if (checkclass(element, thisclass)) element.classList.remove(thisclass);
};

const hide = (element) => {
  if (!checkclass(element, 'hideElement')) element.classList.add('hideElement');
};

const unhide = (element) => {
  if (checkclass(element, 'hideElement')) element.classList.remove('hideElement');
};

const errorResponse = (thisclass, message) => {
  if (checkclass(thisclass, 'errorResponse')) {
    removeClass(thisclass, 'errorResponse');
  }
  thisclass.setAttribute('message', message);
  addClass(thisclass, 'errorResponse');
};

const successResponse = (element, message) => {
  if (checkclass(element, 'successResponse')) {
    removeClass(element, 'successResponse');
  }
  element.setAttribute('message', message);
  addClass(element, 'successResponse');
};
