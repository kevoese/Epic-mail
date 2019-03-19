import errorResponse from '../helper/errorResponse';
import CRUD from '../helper/db_query/crud_db';

class EpicGroup {
  static async newGroup(req, res) {
    const { name } = req.body;
    const ownerId = req.decoded;
    try {
      const itExist = await CRUD.find('groups', 'name', name);
      if (!itExist) {
        await CRUD.insert('groups', '(name, group_owner_id)', [name, ownerId]);
        return res.status(200).send({
          status: 'Successful',
          data: {
            name,
            role: 'owner',
          },
        });
      }
    } catch (err) {
      errorResponse(500, 'Something went wrong', res);
    }
    return errorResponse(409, 'Group name already exist', res);
  }
}


export default EpicGroup;
