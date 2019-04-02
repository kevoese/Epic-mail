import pool from './queryMethod';

const dropUsersTable = 'DROP TABLE IF EXISTS users';
const dropMessagesTable = 'DROP TABLE IF EXISTS messages';
const dropGroupsTable = 'DROP TABLE IF EXISTS groups';
const dropJointTable = 'DROP TABLE IF EXISTS joint';
const dropInboxTable = 'DROP TABLE IF EXISTS inbox';
const dropSentTable = 'DROP TABLE IF EXISTS sent';


async function dropTables() {
  try {
    await pool.query(dropJointTable);
    await pool.query(dropSentTable);
    await pool.query(dropInboxTable);
    await pool.query(dropUsersTable);
    await pool.query(dropMessagesTable);
    await pool.query(dropGroupsTable);
    console.log('tables deleted');
  } catch (error) {
    console.log(error);
  }
}

dropTables();
