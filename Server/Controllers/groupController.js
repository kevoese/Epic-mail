/* eslint-disable no-unused-expressions */
import errorResponse from '../helper/errorResponse';
import pool from '../helper/db_query/queryMethod';
import someFxn from '../helper/myFunction';
import queries from '../helper/db_query/queries';

const { userQuery, msgQuery, groupsQuery } = queries;

const { multiInsert } = someFxn;

class EpicGroup {
  static async newGroup(req, res) {
    let { name } = req.body;
    const ownerId = req.decoded;
    name = name.trim();
    try {
      const { rows } = await pool.query(groupsQuery.getName, [name]);
      if (rows[0] === undefined) {
        const result = await pool.query(groupsQuery.insertNewGroup, [name, ownerId]);
        const { id } = result.rows[0];
        await pool.query(groupsQuery.insertNewMember, [id, ownerId]);
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

  static async getGroups(req, res) {
    const userId = req.decoded;
    const allGroups = await pool.query(groupsQuery.getGroups, [userId]);
    if (allGroups.rows[0] !== undefined) {
      const results = [];
      allGroups.rows.forEach((group) => {
        const { id, name, admin } = group;
        let role;
        (userId === admin) ? role = 'admin' : role = 'member';
        results.push({
          id, name, role, admin,
        });
      });
      return res.status(200).send({
        status: 'Successful',
        data: results,
      });
    }
    return res.status(200).send({
      status: 'Empty',
      data: 'No groups available',
    });
  }

  static async getMembers(req, res) {
    const userId = req.decoded;
    const groupId = req.params.id;
    const getMembership = await pool.query(groupsQuery.getMember, [groupId, userId]);
    if (getMembership.rows[0] !== undefined) {
      const allMembers = await pool.query(groupsQuery.getAllMembers, [groupId]);
      if (allMembers.rows[0] !== undefined) {
        return res.status(200).send({
          status: 'Successful',
          data: allMembers.rows,
        });
      }
    }
    return errorResponse(404, 'Group not found', res);
  }

  static async updateName(req, res) {
    const userId = req.decoded;
    const groupId = req.params.id;
    let { name } = req.body;
    name = name.trim();
    try {
      const getAdmin = await pool.query(groupsQuery.getAdmin, [groupId, userId]);
      if (getAdmin.rows[0] !== undefined) {
        const update = await pool.query(groupsQuery.updateGroupName, [name, groupId]);
        return res.status(200).send({
          status: 'Successful',
          data: update.rows[0],
        });
      }
    } catch (err) {
      return errorResponse(400, 'Invalid request', res);
    }

    return errorResponse(400, 'Bad request', res);
  }

  static async deleteGroup(req, res) {
    const userId = req.decoded;
    const groupId = req.params.id;
    try {
      const getAdmin = await pool.query(groupsQuery.deleteGroup, [groupId, userId]);

      if (getAdmin.rows[0] !== undefined) {
        return res.status(200).send({
          status: 'Successful',
          message: 'Group successfully deleted',
        });
      }
    } catch (err) {
      return errorResponse(500, 'Something went wrong', res);
    }

    return errorResponse(403, 'Bad request', res);
  }

  static async deleteUser(req, res) {
    const userId = req.decoded;
    const { userToDeleteId, groupId } = req.params;
    try {
      const getAdmin = await pool.query(groupsQuery.getAdmin, [groupId, userId]);
      if (getAdmin.rows[0] !== undefined) {
        const update = await pool.query(groupsQuery.deleteMember, [userToDeleteId, groupId]);
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
    return errorResponse(403, 'Bad request', res);
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
    else {
      const checkParentMsg = await pool.query(msgQuery.getParentMsg, [parentMessageId, userId]);
      if (checkParentMsg.rows[0] === undefined) {
        return errorResponse(400, 'invalid parent message', res);
      }
    }
    const readStatus = 'unread';
    const msgArray = [
      subject,
      message,
      groupId,
      userId,
      parentMessageId,
    ];
    const getMembership = await pool.query(groupsQuery.getMember, [groupId, userId]);
    if (getMembership.rows[0] !== undefined) {
      const results = await pool.query(groupsQuery.insertNewMsg, msgArray);
      const newData = results.rows[0];
      const { id } = newData;
      await pool.query(groupsQuery.insertNewSentMsg,
        [id, subject, message, userId, groupId, parentMessageId, status]);
      const { rows } = await pool.query(`SELECT member FROM joint WHERE group_id = ${groupId}`);
      if (rows[0] !== undefined) {
        const insertStr = multiInsert(rows, {
          id, subject, message, userId, groupId, parentMessageId, readStatus,
        });
        await pool.query(`INSERT INTO inbox (user_id, message_id, subject, message, sender_id, group_id, parent_message_id, read_status) VALUES ${insertStr}`);
      }
      return res.status(200).send({
        status: 'Successful',
        message: newData,
      });
    }
    return errorResponse(400, 'Bad request', res);
  }

  static async addGroupUser(req, res) {
    const userId = req.decoded;
    const { groupId } = req.params;
    let { email } = req.body;
    email = email.trim();
    const getAdmin = await pool.query(groupsQuery.getAdmin, [groupId, userId]);
    const result = await pool.query(userQuery.getEmail, [email]);
    if (result.rows[0] === undefined) {
      return errorResponse(404, 'Email does not exist', res);
    }
    const memberId = result.rows[0].id;
    if (memberId === userId) {
      return errorResponse(400, 'Bad request', res);
    }
    if (getAdmin.rows[0] !== undefined) {
      const isMember = await pool.query(groupsQuery.getMember, [groupId, memberId]);
      if (isMember.rows[0] !== undefined) { return errorResponse(409, 'User already exist in group', res); }
      await pool.query(groupsQuery.insertNewMember, [groupId, memberId]);
      return res.status(200).send({
        status: 'Successful',
        data: 'User successfully added to group',
      });
    }
    return errorResponse(400, 'Not an admin of the group', res);
  }

  static async getGroupMessages(req, res) {
    const userId = req.decoded;
    const { id } = req.params;
    const getMembership = await pool.query(groupsQuery.getMember, [id, userId]);
    if (getMembership.rows[0] !== undefined) {
      const results = await pool.query(groupsQuery.getGroupMsgs, [id]);
      const newData = results.rows;
      return res.status(200).send({
        status: 'Successful',
        data: newData,
      });
    }
    return errorResponse(400, 'Bad request', res);
  }
}

export default EpicGroup;
