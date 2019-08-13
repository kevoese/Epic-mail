const queries = {
  userQuery: {
    getEmail: 'SELECT * FROM users WHERE email = $1',
    getUser: 'SELECT firstname, lastname, profile_pic, mobile_no, alt_email, email FROM users WHERE id = $1',
    getResetUser: 'SELECT id, mobile_no, alt_email, email FROM users WHERE email = $1',
    insertNewUser: 'INSERT INTO users (firstname, lastname, email, passwordhash, alt_email) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    updateFirstName: 'UPDATE users SET firstname = $1 WHERE id = $2 RETURNING firstname, lastname, profile_pic, mobile_no, alt_email',
    updateLastName: 'UPDATE users SET lastname = $1 WHERE id = $2 RETURNING firstname, lastname, profile_pic, mobile_no, alt_email',
    updateProfilePic: 'UPDATE users SET profile_pic = $1 WHERE id = $2 RETURNING firstname, lastname, profile_pic, mobile_no, alt_email',
    updateMobileNo: 'UPDATE users SET mobile_no = $1 WHERE id = $2 RETURNING firstname, lastname, profile_pic, mobile_no, alt_email',
    updateAltEmail: 'UPDATE users SET alt_email = $1 WHERE id = $2 RETURNING firstname, lastname, profile_pic, mobile_no, alt_email',
    updatePassword: 'UPDATE users SET passwordhash = $1 WHERE id = $2 RETURNING email, alt_email',
    getContacts: 'SELECT * FROM contacts WHERE user_id = $1',
    welcomeMsg: 'Welcome to epic mail. Experience fast, smooth and easy exchange of information with Epic Mail. To get started with epicmail, create a message or click on \'view groups\' to create a new group',
  },

  msgQuery: {
    insertNewMsg: 'INSERT INTO messages (subject, message, receiver_id, sender_id, parent_message_id, status, thread_id) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *',
    insertNewSentMsg: 'INSERT INTO sent (message_id, subject, message, user_id, receiver_id, parent_message_id, status, thread_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8)',
    insertNewInboxMsg: 'INSERT INTO inbox (message_id, subject, message, user_id, sender_id, parent_message_id, read_status, thread_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8)',
    insertNewThread: 'INSERT INTO threads (receiver_id, sender_id) VALUES($1, $2) RETURNING *',
    updateParentMsg: 'UPDATE messages SET thread_id = $1 WHERE id = $2 RETURNING thread_id',
    updateParentMsgInbox: 'UPDATE inbox SET thread_id = $1 WHERE message_id = $2 RETURNING thread_id',
    updateParentMsgSent: 'UPDATE sent SET thread_id = $1 WHERE message_id = $2 RETURNING thread_id',
    getInbox: 'SELECT inbox.id, created_on, user_id, sender_id, group_id, message_id, subject, message, read_status, parent_message_id, thread_id, email, firstname, lastname FROM inbox JOIN users ON inbox.sender_id = users.id WHERE user_id = $1 ORDER BY created_on DESC',
    getThread: 'SELECT * FROM messages WHERE (thread_id = $1 AND status = \'sent\') AND (sender_id = $2 OR receiver_id = $2) ORDER BY created_on DESC',
    getUnread: 'SELECT inbox.id, created_on, user_id, sender_id, group_id, message_id, subject, message, read_status, parent_message_id, thread_id, email, firstname, lastname FROM inbox JOIN users ON inbox.sender_id = users.id WHERE (user_id = $1 AND read_status = \'unread\' ) ORDER BY created_on DESC',
    getRead: 'SELECT inbox.id, created_on, user_id, sender_id, group_id, message_id, subject, message, read_status, parent_message_id, thread_id, email, firstname, lastname FROM inbox JOIN users ON inbox.sender_id = users.id WHERE (user_id = $1 AND read_status = \'read\' ) ORDER BY created_on DESC',
    getSent: 'SELECT sent.id, created_on, user_id, receiver_id, group_id, message_id, subject, message, status, parent_message_id, thread_id, email, firstname, lastname FROM sent JOIN users ON sent.receiver_id = users.id WHERE (user_id = $1 AND status = \'sent\' ) ORDER BY created_on DESC',
    getDraft: 'SELECT sent.id, created_on, user_id, receiver_id, group_id, message_id, subject, message, status, parent_message_id, thread_id, email, firstname, lastname FROM sent JOIN users ON sent.receiver_id = users.id WHERE (user_id = $1 AND status = \'draft\' ) ORDER BY created_on DESC',
    getSpecificMsg: 'SELECT inbox.id, created_on, user_id, sender_id, group_id, message_id, subject, message, read_status, parent_message_id, thread_id, email, firstname, lastname, profile_pic, FROM inbox JOIN users ON inbox.sender_id = users.id WHERE (message_id = $1) AND (user_id = $2 OR sender_id = $2)',
    updateReadStat: 'UPDATE inbox SET read_status = \'read\' WHERE (message_id = $1) AND (user_id = $2) RETURNING *',
    getDelUsers: 'SELECT sender_id, user_id FROM inbox WHERE (message_id = $1) AND (user_id = $2 OR sender_id = $2)',
    delInboxMsg: 'DELETE FROM inbox WHERE message_id = $1',
    delSentMsg: 'DELETE FROM sent WHERE message_id = $1',
    getParentMsg: 'SELECT inbox.id, created_on, user_id, sender_id, group_id, message_id, subject, message, read_status, parent_message_id, thread_id, email, firstname, lastname FROM inbox JOIN users ON inbox.sender_id = users.id WHERE (message_id = $1 and user_id = $2)',
    getMessageUsers: 'SELECT * FROM messages WHERE id = $1',
    getFromInbox: 'SELECT inbox.id, created_on, user_id, sender_id, group_id, message_id, subject, message, read_status, parent_message_id, thread_id, email, firstname, lastname, profile_pic FROM inbox JOIN users ON inbox.sender_id = users.id WHERE (message_id = $1) AND (user_id = $2) ORDER BY created_on DESC',
    getFromSent: 'SELECT sent.id, created_on, user_id, receiver_id, group_id, message_id, subject, message, status, parent_message_id, thread_id, email, firstname, lastname, profile_pic FROM sent JOIN users ON sent.receiver_id = users.id WHERE (message_id = $1) AND (user_id = $2) ORDER BY created_on DESC',
    getContacts: 'SELECT * FROM contacts WHERE (user_id = $1) AND (contact_email = $2) ORDER BY id DESC',
    insertContact: 'INSERT INTO contacts (user_id, contact_email) VALUES($1, $2) RETURNING *',
  },

  groupsQuery: {
    getName: 'SELECT * FROM groups WHERE name = $1',
    insertNewGroup: 'INSERT INTO groups (name, admin) VALUES($1, $2) RETURNING *',
    insertNewMember: 'INSERT INTO joint (group_id, member) VALUES($1, $2) RETURNING *',
    getGroups: `SELECT groups.id, groups.name, groups.admin FROM groups JOIN
    joint ON groups.id = joint.group_id  WHERE joint.member = $1 ORDER BY created_on DESC`,
    getAdmin: 'SELECT * FROM groups WHERE (id = $1 AND admin = $2)',
    updateGroupName: 'UPDATE groups SET name = $1 WHERE id = $2 RETURNING name',
    deleteGroup: 'DELETE FROM groups WHERE (id = $1 AND admin = $2) RETURNING *',
    deleteMember: 'DELETE FROM joint WHERE (member = $1 AND group_id =$2) RETURNING *',
    getGroupMsgs: 'SELECT * FROM messages WHERE group_id = $1 ORDER BY created_on DESC',
    getMember: 'SELECT * FROM joint WHERE (group_id = $1 AND member = $2)',
    getAllMembers: 'SELECT * FROM groups JOIN joint ON groups.id = joint.group_id WHERE (group_id = $1) ORDER BY created_on DESC',
    insertNewMsg: 'INSERT INTO messages (subject, message, group_id, sender_id, parent_message_id, status) VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
    insertNewSentMsg: 'INSERT INTO sent (message_id, subject, message, user_id, group_id, parent_message_id, status) VALUES($1, $2, $3, $4, $5, $6, $7)',
  },
};

export default queries;
