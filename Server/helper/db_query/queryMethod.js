import pg from 'pg';
import dotenv from 'dotenv';


const { Pool } = pg;

dotenv.config();

const enviroment = process.env.NODE_ENV;

const connectionURL = enviroment === 'test' ? process.env.TEST_DATABASE_URL : process.env.TEST_DATABASE_URL;


const pool = new Pool({
  connectionString: connectionURL,
});

pool.on('connect', () => {
});


const query = async (obj) => {
  const { str, values } = obj;
  try {
    const res = await pool.query(str, values);
    return res;
  } catch (err) {
    console.log(err.error);
    return false;
  }
};


export { query, pool };
