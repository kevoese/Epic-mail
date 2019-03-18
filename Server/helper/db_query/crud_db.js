import { query } from './queryMethod';

const format = (count) => {
  let result = '$1';
  for (let i = 2; i <= count; i += 1) result += `, $${i}`;
  return `VALUES(${result})`;
};

const error = new Error('invalid access');

const CRUD = {
  async insert(table, dbKeys, values) {
    const insertObj = {
      values,
      str: `INSERT INTO ${table} ${dbKeys} ${format(values.length)} RETURNING *`,
    };
    try {
      const result = await query(insertObj);
      return result.rows;
    } catch (err) {
      throw error;
    }
  },

  async find(table, key, item) {
    const obj = {
      str: `SELECT * FROM ${table} WHERE ${key} = $1`,
      values: [item],
    };
    try {
      const result = await query(obj);
      if (result.rows[0] === undefined) return false;
      return result.rows;
    } catch (err) {
      throw error;
    }
  },

};

export default CRUD;
