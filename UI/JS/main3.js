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


const messagepanel = (msgObj) => {
  const {
    id, senderName, message, subject, read_status, datestr,
  } = msgObj;
  const msghtml = `<div id = "${id}_small" class="wrapmsghead icon ${read_status}msg">
    <p class="username icon">${senderName}</p><p class="msgdate icon">${datestr}</p>
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
      const senderName = `${firstname} ${lastname}`;
      const msgObj = {
        senderName, message_id, subject, message, read_status, datestr,
      };
      inboxhtml.innerHTML += messagepanel(msgObj);
    });
  }
};
