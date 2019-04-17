/* eslint-disable guard-for-in */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable camelcase */
const groupwrap = document.querySelector('.allgroups');
const view = document.querySelector('.chatcontent');
const editGroup = document.querySelector('.editgroup');
let thisUser;

const groupDetails = (details) => {
  const {
    members, adminName, name, id, role,
  } = details;
  const thisAdmin = (role === 'admin') ? 'You' : adminName;
  const edit = (role === 'admin') ? 'edit' : 'hideEdit';
  const grouphtml = `<div id = "${id}_small" class="wrapmsghead">
    <p class="username groupname icon">${name}</p>
    <p class="msgtitle groupnumbers">
        Members: (${members})
    </p>
    <p class="adminname">Admin: ${thisAdmin}</p>
    <span class="vcenter ${edit} icon"></span>
</div>`;

  return grouphtml;
};

const groupUsersSelect = (email, id) => {
  const optionTaghtml = ` <option id = '${id}_user'>${email}</option>`;
  return optionTaghtml;
};

const editgrouphtml = (details) => {
  const { name, id, memberOptions } = details;
  const edithtml = `<div class="newmsg grouphead icon">${name}<div id = "cutmsgedit" class="cutmsgedit icon"></div></div>
    <form id ="${id}_deleteUserForm" class="addContacts">
            <select id = "deleteuser" class="deleteuser">
                    <option  disabled selected>Choose User</option>
                    ${memberOptions}
            </select>
            <button class="deletegroupuser icon">Delete user</button>
    </form>
    <form id = "${id}_changegroupname" class="changegroupname">
        <input id = "editgrpname" type="text" class="newName" value="${name}" disabled >
        <span id="updategrpname" class="updategrpname">Change Group Name</span>
        <button class="savegrpname">Save</button>
    </form> 
    <form id = "${id}_addUserForm" class="addUserForm">
        <input id ="newUserEmail" required type="email" placeholder="Enter email to add user" class="memberEmail">
        <button class="icon addUsers"></button>
    </form>
    <button id = "${id}_deletegrp" class="deletegrp icon"></button>`;

  return edithtml;
};

const grpMessageView = (msgObj) => {
  const {
    senderName, name, message_id, subject, message, profileImg, datestr,
  } = msgObj;
  const msghtml = ` <div id = "${message_id}_big" class="messagewrap">
  <div class="msginfo">
      <span class="subject">${subject}</span>
      <span class="sender">${senderName}</span>
      <span class="from">From:</span>
      <span class="to icon">to</span>
      <span class="receiver">${name}</span>
      <span class="reply icon"></span>
      <img src="${profileImg}" class="senderimg">
      <span class="messageDate icon">(${datestr})</span> 
  </div>
  <p class = "msgP">
      ${message}
  </p> 
  </div>`;

  return msghtml;
};

const populateGroups = async () => {
  const empty = document.querySelector('.empty');
  const getgroupUrl = `${appurl}groups`;
  const { responseObj } = await fetchCall(getgroupUrl, 'GET');
  if (responseObj.status === 'Successful') {
    const groups = responseObj.data;
    groupwrap.innerHTML = await groups.reduce(async (promise_acc, group) => {
      let acc = await promise_acc;
      const {
        id, role, name, admin,
      } = group;
      const memberObj = await fetchCall(`${appurl}groups/${id}/users`, 'GET');
      const members = memberObj.responseObj.data.length;
      const { firstname, lastname } = await getUser(admin);
      const adminName = `${firstname} ${lastname}`;
      const info = {
        adminName, role, name, id, members,
      };
      acc = acc.concat(groupDetails(info));
      return Promise.resolve(acc);
    }, Promise.resolve(''));
  } else if (responseObj.status === 'Empty') {
    groupwrap.innerHTML = emptyMsgBox('No groups available');
  }
};

const populateEditform = async (groupId) => {
  const { responseObj } = await fetchCall(`${appurl}groups/${groupId}/users`, 'GET');
  const { name, id } = responseObj.data[0];
  let memberOptions = '';
  const { data } = responseObj;
  memberOptions = await data.reduce(async (promise_acc, element) => {
    let acc = await promise_acc;
    const { member } = element;
    const { email } = await getUser(member);
    acc = (thisUser.email !== email) ? acc.concat(groupUsersSelect(email, member)) : '';
    return Promise.resolve(acc);
  }, Promise.resolve(''));
  editGroup.innerHTML = editgrouphtml({ name, id, memberOptions });
};

const populateGroupView = async (groupId) => {
  const url = `${appurl}groups/${groupId}/messages`;
  const { responseObj, statusCode } = await fetchCall(url, 'GET');

  if (statusCode === 200) {
    const { data } = responseObj;
    if (data.length < 1) {
      view.innerHTML = emptyMsgBox('No message has been posted to this group');
      return true;
    }
    view.innerHTML = await data.reduce(async (promise_acc, dataObj) => {
      let acc = await promise_acc;
      const {
        message_id, subject, message, created_on, sender_id, group_id,
      } = dataObj;
      const groupDetail = await fetchCall(`${appurl}groups/${group_id}/users`, 'GET');
      const { name } = groupDetail.responseObj.data[0];
      const datestr = getDateStr(created_on);
      const sender = await getUser(sender_id);
      const senderName = (thisUser.email === sender.email) ? 'You' : `${sender.firstname} ${sender.lastname}  <p> < ${sender.email} > </p>`;
      const profileImg = sender.profile_pic;
      const msgObj = {
        senderName, name, message_id, subject, message, profileImg, datestr,
      };
      acc = acc.concat(grpMessageView(msgObj));
      return Promise.resolve(acc);
    }, Promise.resolve(' '));
  }
  if (statusCode === 400) {
    console.log('bad request');
  }
};
