import pg from 'pg';
import dotenv from 'dotenv';


const { Pool } = pg;

dotenv.config();

// const enviroment = process.env.NODE_ENV;

// const connectionURL = enviroment === 'test' ? process.env.TEST_DATABASE_URL : process.env.TEST_DATABASE_URL;


const pool = new Pool({
  connectionString: process.env.TEST_DATABASE_URL,
});

pool.on('connect', () => {
});


export default pool;
