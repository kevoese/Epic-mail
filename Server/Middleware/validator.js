import schema from '../helper/schemas';
import joiTest from '../helper/JoiTest';

class Validate {
  static validateSignup(req, res, next) {
    const {
      firstname, lastname, email, password,
    } = req.body;
    const user = {
      firstname, lastname, email, password,
    };
    joiTest(user, schema.userschema, res, next);
  }

  static validateLogin(req, res, next) {
    const {
      email, password,
    } = req.body;
    joiTest({ email, password }, schema.loginschema, res, next);
  }

  static validateMessage(req, res, next) {
    const {
      subject, message, parentMessageId, status, receiverEmail,
    } = req.body;

    const newMessage = {
      subject, message, parentMessageId, status, receiverEmail,
    };

    joiTest(newMessage, schema.messageschema, res, next);
  }

  static validateProfile(req, res, next) {
    const {
      firstname, lastname, profilePic,
    } = req.body;
    const updateuser = {
      firstname, lastname, profilePic,
    };

    joiTest(updateuser, schema.profileschema, res, next);
  }

  static validateNewGroup(req, res, next) {
    const { name } = req.body;
    joiTest({ name }, schema.groupschema, res, next);
  }

  static validateUpdateGroup(req, res, next) {
    const { name } = req.body;
    const groupId = req.params.id;
    joiTest({ name, groupId }, schema.updategroupschema, res, next);
  }

  static validateJustId(req, res, next) {
    const { id } = req.params;
    joiTest({ id }, schema.onlyIdSchema, res, next);
  }

  static validateUserDelete(req, res, next) {
    const { groupId } = req.params;
    const userId = req.params.userToDeleteId;
    joiTest({ groupId, userId }, schema.userDelete, res, next);
  }

  static validateGroupMsg(req, res, next) {
    const {
      subject, message,
      parentMessageId, status,
    } = req.body;
    const { groupId } = req.params;
    const newMessage = {
      subject, message, groupId, parentMessageId, status,
    };
    joiTest(newMessage, schema.sendgroupmsg, res, next);
  }

  static validateAddGroupUsers(req, res, next) {
    const { email } = req.body;
    const { groupId } = req.params;
    const newMessage = { email, groupId };
    joiTest(newMessage, schema.addGroupUsers, res, next);
  }
}

export default Validate;
