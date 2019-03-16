import pg from 'pg';
import dotenv from 'dotenv';


const { Pool } = pg;

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('connect', () => {
});


const queryFxn = async (obj) => {
  const { str, values } = obj;
  try {
    const res = await pool.query(str, values);
    return res;
  } catch (err) {
    return false;
  }
};


export default queryFxn;
