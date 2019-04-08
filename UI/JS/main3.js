/* eslint-disable no-undef */
/* eslint-disable camelcase */
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

const checkboxes = `<div class="checkbox">
<div class="read icon">
    <input id = "incheckbox1" type="checkbox" class="incheckbox">
    <label class = "icon" for = "incheckbox1">Unread</label>
</div>
<div class="unread icon">
    <input id = "incheckbox2" type="checkbox" class="incheckbox">
    <label class = "icon" for = "incheckbox2">Read</label>
</div>
</div>`;

const emptyMsgBox = message => `<p class="empty">
${message}
</p>`;


const messagepanel = (msgObj) => {
  const {
    message_id, Name, message, subject, status, datestr,
  } = msgObj;
  const msghtml = `<div id = "${message_id}_small" class="wrapmsghead icon ${status}msg">
    <p class="username icon">${Name}</p><p class="msgdate icon">${datestr}</p>
    <p class="msgtitle">
       ${subject}
    </p>
    <p class="msgcontent">${message}</p>
    <span class="delete icon" data-tool-tip="Delete"></span>
</div> `;

  return msghtml;
};


const populateInbox = async () => {
  const inboxhtml = document.querySelector('.all');
  const inboxNum = document.querySelector('.allno');
  const url = `${appurl}messages`;
  const { responseObj, statusCode } = await fetchCall(url, 'GET');
  inboxhtml.innerHTML = checkboxes;
  if (statusCode === 200) {
    const { data } = responseObj;
    inboxNum.textContent = data.length;
    data.forEach(async (rMessage) => {
      const {
        message_id, subject, message, read_status, created_on,
      } = rMessage;
      const datestr = getDateStr(created_on);
      const { firstname, lastname } = await getUser(rMessage.sender_id);
      const Name = `${firstname} ${lastname}`;
      const status = read_status;
      const msgObj = {
        Name, message_id, subject, message, status, datestr,
      };
      inboxhtml.innerHTML += messagepanel(msgObj);
    });
  }
  if (statusCode === 404) {
    inboxNum.textContent = 0;
    inbboxhtml.innerHTML = emptyMsgBox('inbox is empty');
  }
};


const populateOutbox = async (type) => {
  const boxhtml = document.querySelector(`.${type}`);
  const boxNum = document.querySelector(`.${type}no`);
  const url = (type === 'sent') ? `${appurl}messages/sent` : `${appurl}messages/draft`;
  const { responseObj, statusCode } = await fetchCall(url, 'GET');
  if (statusCode === 200) {
    const { data } = responseObj;
    boxNum.textContent = data.length;
    boxhtml.innerHTML = '';
    data.forEach(async (rMessage) => {
      const {
        message_id, subject, message, status, created_on,
      } = rMessage;
      const datestr = getDateStr(created_on);
      const { firstname, lastname } = await getUser(rMessage.receiver_id);
      const Name = `${firstname} ${lastname}`;
      const msgObj = {
        Name, message_id, subject, message, status, datestr,
      };
      boxhtml.innerHTML += messagepanel(msgObj);
    });
  }
  if (statusCode === 404) {
    boxNum.textContent = 0;
    boxhtml.innerHTML = emptyMsgBox(`${type} box is empty`);
  }
};
