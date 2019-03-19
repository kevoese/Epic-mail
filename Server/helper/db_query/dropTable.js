import { pool } from './queryMethod';

const dropUsersTable = 'DROP TABLE IF EXISTS users';
const dropMessagesTable = 'DROP TABLE IF EXISTS messages';
const dropGroupsTable = 'DROP TABLE IF EXISTS groups';
const dropJointTable = 'DROP TABLE IF EXISTS joint';
const dropReadTable = 'DROP TABLE IF EXISTS read';


async function dropTables() {
  try {
    await pool.query(dropUsersTable);
    await pool.query(dropMessagesTable);
    await pool.query(dropJointTable);
    await pool.query(dropGroupsTable);
    await pool.query(dropReadTable);
    console.log('tables deleted');
  } catch (error) {
    console.log(error);
  }
}

dropTables();

