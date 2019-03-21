/* eslint-disable no-unused-expressions */
import errorResponse from '../helper/errorResponse';
import CRUD from '../helper/db_query/crud_db';
import { pool } from '../helper/db_query/queryMethod';
import someFxn from '../helper/myFunction';

const { toDBArray } = someFxn;

class EpicGroup {
  static async newGroup(req, res) {
    let { name } = req.body;
    const ownerId = req.decoded;
    name = name.trim();
    try {
      const itExist = await CRUD.find('groups', 'name', name);
      if (!itExist) {
        const result = await CRUD.insert('groups', '(name, admin)', [name, ownerId]);
        const { id } = result[0];
        await CRUD.insert('joint', '(group_id, member)', [id, ownerId]);
        return res.status(200).send({
          status: 'Successful',
          data: {
            id,
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
    return errorResponse(404, 'Group was not found', res);
  }

  static async updateName(req, res) {
    const userId = req.decoded;
    const groupId = req.params.id;
    let { name } = req.body;
    name = name.trim();
    console.log(name);
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
      return errorResponse(400, 'Invalid request', res);
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
      return errorResponse(404, err, res);
    }

    return errorResponse(401, 'Unauthorized access', res);
  }

  static async deleteUser(req, res) {
    const userId = req.decoded;
    const { userToDeleteId, groupId } = req.params;
    try {
      const getAdmin = await pool.query(`SELECT * FROM groups WHERE (id = ${groupId} AND admin = ${userId})`);
      if (getAdmin.rows[0] !== undefined) {
        const update = await pool.query(`DELETE FROM joint WHERE (member = ${userToDeleteId} AND group_id =${groupId}) RETURNING *`);
        if (update.rows[0] !== undefined) {
          return res.status(200).send({
            status: 'Successful',
            message: 'User successfully deleted',
          });
        }
      }
    } catch (err) {
      return errorResponse(500, 'Something went wrong', res);
    }
    return errorResponse(401, 'Unauthorized access', res);
  }

  static async msgGroup(req, res) {
    const userId = req.decoded;
    const { groupId } = req.params;
    let {
      subject, message, parentMessageId, status,
    } = req.body;
    subject = subject.trim();
    message = message.trim();
    status = status.trim();
    if (parentMessageId === undefined) parentMessageId = null;
    const createdOn = new Date();
    const msgObj = {
      createdOn,
      subject,
      message,
      groupId,
      userId,
      parentMessageId,
      status,
    };
    const getMembership = await pool.query(`SELECT * FROM joint WHERE (group_id = ${groupId} AND member = ${userId})`);
    if (getMembership.rows[0] !== undefined) {
      const [newData] = await CRUD.insert('messages',
        '(created_on, subject, message, groupid, sender_id, parent_message_id, status)',
        toDBArray(msgObj));
      const { id } = newData;
      return res.status(200).send({
        status: 'Successful',
        message: {
          id,
          createdOn,
          subject,
          message,
          parentMessageId,
          status,
          groupId,
        },
      });
    }
    return errorResponse(401, 'Unauthorized access', res);
  }

  static async addGroupUser(req, res) {
    const userId = req.decoded;
    const { groupId } = req.params;
    let { email } = req.body;
    email = email.trim();
    const getAdmin = await pool.query(`SELECT * FROM groups WHERE (id = ${groupId} AND admin = ${userId})`);
    const result = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (result.rows[0] === undefined) {
      return errorResponse(401, 'Email does not exist', res);
    }
    const memberId = result.rows[0].id;
    if (memberId === userId) {
      return errorResponse(401, 'You cannot add yourself to the group', res);
    }
    if (getAdmin.rows[0] !== undefined) {
      const isMember = await pool.query('SELECT * FROM joint WHERE (member = $1 AND group_id = $2)', [memberId, groupId]);
      if (isMember.rows[0] !== undefined) { return errorResponse(401, 'User already exist in group', res); }
      await pool.query(`INSERT INTO joint (group_id, member) VALUES(${groupId}, ${memberId})`);
      const allGroups = await pool.query(`SELECT * FROM groups 
       JOIN joint ON groups.id = joint.group_id  WHERE groups.admin = ${userId};`);
      if (allGroups.rows[0] !== undefined) {
        return res.status(200).send({
          status: 'Successful',
          data: 'User successfully added to groups',
        });
      }
    }
    return errorResponse(401, 'Not an admin of the group', res);
  }
}

export default EpicGroup;
