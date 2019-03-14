import errorResponse from '../helper/errorResponse';
import database from '../helper/crud';

class EpicGroup {
  static newGroup(req, res) {
    const { name } = req.body;
    const groupOwnerId = req.decoded;

    const groupObj = {
      name,
      groupOwnerId,
      users: [req.decoded],
      role: 'none',
    };
    const newData = database.add('groups', groupObj);
    let { id, role } = newData;
    role = 'owner';
    return res.status(200).json({
      status: 200,
      data: {
        id,
        name,
        role,
      },
    });
  }
}

export default EpicGroup;
