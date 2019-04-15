import pool from './queryMethod';

const users = `CREATE TABLE IF NOT EXISTS
      users(
        id serial PRIMARY KEY,
        email text NOT NULL UNIQUE,
        firstname text NOT NULL,
        lastname text NOT NULL,
        passwordhash text NOT NULL,
        profile_pic text DEFAULT 'https://i.imgur.com/wtjaVfi.png'
      );`;

const messages = `CREATE TABLE IF NOT EXISTS
        messages(
          id serial PRIMARY KEY,
          created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          subject text NOT NULL,
          message text NOT NULL,
          receiver_id integer ,
          group_id integer ,
          sender_id integer ,
          parent_message_id integer,
          thread_id integer,
          FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
          FOREIGN KEY (thread_id) REFERENCES threads(id) ON DELETE CASCADE
        );`;


const groups = `CREATE TABLE IF NOT EXISTS
        groups(
          id serial PRIMARY KEY,
          created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
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

const threads = `CREATE TABLE IF NOT EXISTS
        threads (
          id serial PRIMARY KEY,
          receiver_id integer NOT NULL,
          sender_id integer NOT NULL
        );`;

const sent = `CREATE TABLE IF NOT EXISTS
        sent(
          id serial PRIMARY KEY,
          created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          user_id integer,
          receiver_id integer,
          group_id integer,
          message_id integer,
          subject text NOT NULL,
          message text NOT NULL,
          status text,
          parent_message_id integer,
          thread_id integer,
          FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
          FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (thread_id) REFERENCES threads(id) ON DELETE CASCADE
        );`;

const inbox = `CREATE TABLE IF NOT EXISTS
        inbox(
          id serial PRIMARY KEY,
          created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          user_id integer,
          sender_id integer,
          group_id integer,
          message_id integer,
          subject text NOT NULL,
          message text NOT NULL,
          read_status text,
          parent_message_id integer,
          thread_id integer,
          FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
          FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (thread_id) REFERENCES threads(id) ON DELETE CASCADE
        );`;


const create = `${users}${groups}${groupJoin}${threads}${messages}${sent}${inbox}`;
const createTables = async () => {
  await pool.query(create);
};

createTables();
