import PG from 'pg';
import dotenv from 'dotenv';

const { Pool } = PG;

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('connect', () => {
  console.log('connected to the db');
});

const dropUsersTable = 'DROP TABLE IF EXISTS users';
const dropMessagesTable = 'DROP TABLE IF EXISTS messages';
const dropGroupsTable = 'DROP TABLE IF EXISTS groups';
const dropReadTable = 'DROP TABLE IF EXISTS read';


async function dropTables() {
  try {
    await pool.query(dropUsersTable);
    await pool.query(dropMessagesTable);
    await pool.query(dropGroupsTable);
    await pool.query(dropReadTable);
    console.log('tables deleted');
  } catch (error) {
    console.log(error);
  }
}

dropTables();
