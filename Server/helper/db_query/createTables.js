import { pool } from './queryMethod';
import database from '../crud';
import CRUD from './crud_db';
import someFxn from '../myFunction';

const { toDBArray } = someFxn;

const userObj = database.getStorage('users');
const msgObj = database.getStorage('messages');
const readObj = database.getStorage('read');


const users = `CREATE TABLE IF NOT EXISTS
      users(
        id serial PRIMARY KEY,
        email text NOT NULL UNIQUE,
        firstname text NOT NULL,
        lastname text NOT NULL,
        passwordhash text NOT NULL
      );`;

const messages = `CREATE TABLE IF NOT EXISTS
        messages(
          id serial PRIMARY KEY,
          created_on TIMESTAMP NOT NULL,
          subject text NOT NULL,
          message text NOT NULL,
          receiver_id integer ,
          sender_id integer ,
          parent_message_id integer,
          status text ,
          receiver_del BOOL ,
          groupid integer REFERENCES groups(id)
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
          name text NOT NULL UNIQUE,
          admin integer NOT NULL
        );`;

const groupJoin = `CREATE TABLE IF NOT EXISTS
        joint(
          group_id integer NOT NULL,
          member integer NOT NULL,
          FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
          FOREIGN KEY (member) REFERENCES users(id) ON DELETE CASCADE
        );`;

const create = `${users}${groups}${groupJoin}${messages}${read}`;
const populateDB = async () => {
  await pool.query(create);
  try {
    userObj.forEach((obj) => {
      CRUD.insert('users', '(email, firstname, lastname, passwordhash)',
        toDBArray(obj));
    });
    msgObj.forEach((obj) => {
      CRUD.insert('messages', '(created_on, subject, message, receiver_id, sender_id, parent_message_id, status, receiver_del)',
        toDBArray(obj));
    });
    readObj.forEach((obj) => {
      CRUD.insert('read', '(user_id, message_id)', toDBArray(obj));
    });

    CRUD.insert('groups', '(name, admin)', ['great', 1]);
    CRUD.insert('groups', '(name, admin)', ['it has been God all the way', 2]);
    CRUD.insert('joint', '(group_id, member)', [1, 1]);
    // CRUD.insert('joint', '(group_id, member)', [1, 2]);
    CRUD.insert('joint', '(group_id, member)', [2, 1]);
  } catch (err) { console.log(err); }
};

populateDB();

// pool.on('remove', () => {
//   console.log('client removed');
//   process.exit(0);
// });
