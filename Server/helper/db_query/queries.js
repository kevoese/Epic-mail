const queries = {
  userQuery: {
    getEmail: 'SELECT * FROM users WHERE email = $1',
    getUser: 'SELECT firstname, lastname, email, profile_pic FROM users WHERE id = $1',
    insertNewUser: 'INSERT INTO users (firstname, lastname, email, passwordhash) VALUES ($1, $2, $3, $4) RETURNING *',
    updateFirstName: 'UPDATE users SET firstname = $1 WHERE id = $2 RETURNING firstname, lastname, profile_pic',
    updateLastName: 'UPDATE users SET lastname = $1 WHERE id = $2 RETURNING firstname, lastname, profile_pic',
    updateProfilePic: 'UPDATE users SET profile_pic = $1 WHERE id = $2 RETURNING firstname, lastname, profile_pic',
  },

  msgQuery: {
    insertNewMsg: 'INSERT INTO messages (subject, message, receiver_id, sender_id, parent_message_id) VALUES($1, $2, $3, $4, $5) RETURNING *',
    insertNewSentMsg: 'INSERT INTO sent (message_id, subject, message, user_id, receiver_id, parent_message_id, status) VALUES($1, $2, $3, $4, $5, $6, $7)',
    insertNewInboxMsg: 'INSERT INTO inbox (message_id, subject, message, user_id, sender_id, parent_message_id, read_status) VALUES($1, $2, $3, $4, $5, $6, $7)',
    getInbox: 'SELECT * FROM inbox WHERE user_id = $1',
    getUnread: 'SELECT * FROM inbox WHERE (user_id = $1 AND read_status = \'unread\' )',
    getRead: 'SELECT * FROM inbox WHERE (user_id = $1 AND read_status = \'read\' )',
    getSent: 'SELECT * FROM sent WHERE (user_id = $1 AND status = \'sent\' )',
    getDraft: 'SELECT * FROM sent WHERE (user_id = $1 AND status = \'draft\' )',
    getSpecificMsg: 'SELECT * FROM inbox WHERE (message_id = $1) AND (user_id = $2 OR sender_id = $2)',
    updateReadStat: 'UPDATE inbox SET read_status = \'read\' WHERE (message_id = $1) AND (user_id = $2) RETURNING *',
    getDelUsers: 'SELECT sender_id, user_id FROM inbox WHERE (message_id = $1) AND (user_id = $2 OR sender_id = $2)',
    delInboxMsg: 'DELETE FROM inbox WHERE message_id = $1',
    delSentMsg: 'DELETE FROM sent WHERE message_id = $1',
    getParentMsg: 'SELECT * FROM inbox WHERE (message_id = $1 and user_id = $2)',
    getMessageUsers: 'SELECT * FROM messages WHERE id = $1',
    getFromInbox: 'SELECT * FROM inbox WHERE (message_id = $1) AND (user_id = $2)',
    getFromSent: 'SELECT * FROM sent WHERE (message_id = $1) AND (user_id = $2)',
  },

  groupsQuery: {
    getName: 'SELECT * FROM groups WHERE name = $1',
    insertNewGroup: 'INSERT INTO groups (name, admin) VALUES($1, $2) RETURNING *',
    insertNewMember: 'INSERT INTO joint (group_id, member) VALUES($1, $2) RETURNING *',
    getGroups: `SELECT groups.id, groups.name, groups.admin FROM groups JOIN
    joint ON groups.id = joint.group_id  WHERE joint.member = $1;`,
    getAdmin: 'SELECT * FROM groups WHERE (id = $1 AND admin = $2)',
    updateGroupName: 'UPDATE groups SET name = $1 WHERE id = $2 RETURNING name',
    deleteGroup: 'DELETE FROM groups WHERE (id = $1 AND admin = $2) RETURNING *',
    deleteMember: 'DELETE FROM joint WHERE (member = $1 AND group_id =$2) RETURNING *',
    getGroupMsgs: 'SELECT * FROM messages WHERE group_id = $1',
    getMember: 'SELECT * FROM joint WHERE (group_id = $1 AND member = $2)',
    getAllMembers: 'SELECT * FROM groups JOIN joint ON groups.id = joint.group_id WHERE (group_id = $1)',
    insertNewMsg: 'INSERT INTO messages (subject, message, group_id, sender_id, parent_message_id) VALUES($1, $2, $3, $4, $5) RETURNING *',
    insertNewSentMsg: 'INSERT INTO sent (message_id, subject, message, user_id, group_id, parent_message_id, status) VALUES($1, $2, $3, $4, $5, $6, $7)',
  },
};

export default queries;
