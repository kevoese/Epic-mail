/* eslint-disable no-undef */
/* eslint-disable camelcase */
const groupwrap = document.querySelector('.allgroups');

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

const populateGroups = async () => {
  const getgroupUrl = `${appurl}groups`;
  const { responseObj } = await fetchCall(getgroupUrl, 'GET');
  if (responseObj.status === 'Successful') {
    const groups = responseObj.data;
    groupwrap.innerHTML = ' ';
    groups.forEach(async (group) => {
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
      groupwrap.innerHTML += groupDetails(info);
    });
  } else if (responseObj.status === 'Empty') {
    empty.innerHTM = emptyMsgBox('No groups available');
  }
};
