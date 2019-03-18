import pg from 'pg';
import dotenv from 'dotenv';


const { Pool } = pg;

dotenv.config();

const pool = new Pool({
  connectionString: process.env.TEST_DATABASE_URL,
});

pool.on('connect', () => {
});


const query = async (obj) => {
  const { str, values } = obj;
  try {
    const res = await pool.query(str, values);
    return res;
  } catch (err) {
    console.log('errors');
    return false;
  }
};


export { query, pool };
