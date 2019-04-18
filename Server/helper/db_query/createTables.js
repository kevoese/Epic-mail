import pool from './queryMethod';

const users = `CREATE TABLE IF NOT EXISTS
      users(
        id serial PRIMARY KEY,
        email text NOT NULL UNIQUE,
        firstname text NOT NULL,
        lastname text NOT NULL,
        passwordhash text NOT NULL,
        profile_pic text DEFAULT 'https://i.imgur.com/wtjaVfi.png',
        mobile_no numeric NULL,
        alt_email text NULL
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
          status text,
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

const contacts = `CREATE TABLE IF NOT EXISTS
        contacts(
          id serial PRIMARY KEY,
          user_id integer,
          contact_email text NOT NULL
        );`;

const create = `${users}${groups}${groupJoin}${threads}${messages}${sent}${inbox}${contacts}`;
const createTables = async () => {
  await pool.query(create);
  await pool.query('INSERT INTO users (firstname, lastname, email, passwordhash) VALUES(\'Epic\', \'Mail\', \'epicteam@epicmail.com\', \'$2b$10$eVRkMNC6j3K74rA9HoixNeZ0P9y.uWWv6poyIideJP7bw6BqCzcMa\')');
};

createTables();
