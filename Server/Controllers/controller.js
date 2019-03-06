import token from '../helper/token';
import users from '../Models/users';

class Epic {
  static welcome(req, res) {
    return res.status(200).json({
      message: 'Welcome to EPic mail',
    });
  }

  static signup(req, res) {
    const {
      firstname, lastname, email, password,
    } = req.body;
    const id = users.length + 1;
    const userObj = {
      id, firstname, lastname, email, password,
    };
    users.push(userObj);
    return res.status(200).json({
      status: 200,
      data: { Token: token({ id: userObj.id }) },
    });
  }
}

export default Epic;
