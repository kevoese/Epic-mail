import pg from 'pg';
import dotenv from 'dotenv';
import database from '../crud';
import CRUD from './crud_db';
import someFxn from '../myFunction';

const { toDBArray } = someFxn;

const userObj = database.getStorage('users');
const msgObj = database.getStorage('messages');
const readObj = database.getStorage('read');

const { Pool } = pg;

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('connect', () => {
  console.log('connected to the db');
});

const users = `CREATE TABLE IF NOT EXISTS
      users(
        id serial PRIMARY KEY,
        firstname text NOT NULL,
        lastname text NOT NULL,
        email text NOT NULL UNIQUE,
        passwordhash text NOT NULL UNIQUE
      );`;

const messages = `CREATE TABLE IF NOT EXISTS
        messages(
          id serial PRIMARY KEY,
          created_on TIMESTAMP NOT NULL,
          subject text NOT NULL,
          message text NOT NULL,
          receiver_id integer NOT NULL,
          sender_id integer NOT NULL,
          parent_message_id integer,
          status text NOT NULL,
          receiver_del BOOL NOT NULL
        );`;

const read = `CREATE TABLE IF NOT EXISTS
        read(
          id serial PRIMARY KEY,
          user_id integer NOT NULL,
          message_id integer NOT NULL
        );`;

const groups = `CREATE TABLE IF NOT EXISTS
        groups(
          id serial PRIMARY KEY,
          name text NOT NULL,
          group_owner_id integer NOT NULL
        );`;

const create = `${users}${messages}${read}${groups}`;

pool.query(create)
  .then((res) => {
    const {
      firstname, lastname, email, passwordhash,
    } = userObj[0];
    CRUD.insert('users', '(firstname, lastname, email, passwordhash)', [firstname, lastname, email, passwordhash]);
    msgObj.forEach((obj) => {
      CRUD.insert('messages', '(created_on, subject, message, receiver_id, sender_id, parent_message_id, status, receiver_del)',
        toDBArray(obj, true));
    });
    const { userId, messageId } = readObj[0];
    CRUD.insert('read', '(user_id, message_id)', [userId, messageId]);
    console.log(res);
  })
  .catch((err) => { console.log(err); });


pool.on('remove', () => {
  console.log('client removed');
  process.exit(0);
});
