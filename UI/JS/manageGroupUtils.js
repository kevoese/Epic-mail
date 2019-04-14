/* eslint-disable guard-for-in */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable camelcase */
const groupwrap = document.querySelector('.allgroups');
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
        <input id ="newUserEmail" required type="text" placeholder="Enter email to add user" class="newmsgsearch memberEmail">
        <button class="plus icon addUsers"></button>
    </form>
    <button id = "${id}_deletegrp" class=" deletegrp icon"></button>`;

  return edithtml;
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
    empty.innerHTML = emptyMsgBox('No groups available');
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
