/* eslint-disable no-unused-expressions */
import errorResponse from '../helper/errorResponse';
import CRUD from '../helper/db_query/crud_db';
import { pool } from '../helper/db_query/queryMethod';

class EpicGroup {
  static async newGroup(req, res) {
    const { name } = req.body;
    const ownerId = req.decoded;
    try {
      const itExist = await CRUD.find('groups', 'name', name);
      if (!itExist) {
        const result = await CRUD.insert('groups', '(name, admin)', [name, ownerId]);
        const { id } = result[0];
        await CRUD.insert('joint', '(group_id, member)', [id, ownerId]);
        return res.status(200).send({
          status: 'Successful',
          data: {
            name,
            role: 'owner',
          },
        });
      }
    } catch (err) {
      return errorResponse(500, 'Something went wrong', res);
    }
    return errorResponse(409, 'Group name already exist', res);
  }

  static async getGroup(req, res) {
    const userId = req.decoded;
    const allGroups = await pool.query(`SELECT groups.id, groups.name, groups.admin FROM groups
       JOIN joint ON groups.id = joint.group_id  WHERE joint.member = ${userId};`);
    if (allGroups.rows[0] !== undefined) {
      const results = [];
      allGroups.rows.forEach((group) => {
        const { id, name, admin } = group;
        let role;
        (userId === admin) ? role = 'admin' : role = 'member';
        results.push({ id, name, role });
      });
      return res.status(200).send({
        status: 'Successful',
        data: results,
      });
    }
    return errorResponse(404, 'Groups was not found', res);
  }

  static async updateName(req, res) {
    const userId = req.decoded;
    const groupId = req.params.id;
    const { name } = req.body;
    try {
      const getAdmin = await pool.query(`SELECT * FROM groups WHERE (id = ${groupId} AND admin = ${userId})`);
      if (getAdmin.rows[0] !== undefined) {
        const update = await pool.query(`UPDATE groups SET name = $1 WHERE id = ${groupId} RETURNING name`, [name]);
        return res.status(200).send({
          status: 'Successful',
          data: update.rows[0],
        });
      }
    } catch (err) {
      return errorResponse(404, 'Invalid request', res);
    }

    return errorResponse(401, 'Unauthorized access', res);
  }

  static async deleteGroup(req, res) {
    const userId = req.decoded;
    const groupId = req.params.id;
    try {
      const getAdmin = await pool.query(`DELETE FROM groups WHERE (id = ${groupId} AND admin = ${userId}) RETURNING *`);
      if (getAdmin.rows[0] !== undefined) {
        return res.status(200).send({
          status: 'Successful',
          message: 'Group successfully deleted',
        });
      }
    } catch (err) {
      return errorResponse(404, 'Invalid request', res);
    }

    return errorResponse(401, 'Unauthorized access', res);
  }


}

export default EpicGroup;
