import joi from 'joi';
import schema from '../helper/schemas';
import errorResponse from '../helper/errorResponse';

const joiFormat = (error) => {
  let format = error;
  format = format.slice(format.indexOf('[') + 1, format.indexOf(']'));
  format = format.replace(/"/gi, '');
  return format;
};

class Validate {
  static validateSignup(req, res, next) {
    const {
      firstname, lastname, email, password,
    } = req.body;
    const user = {
      firstname, lastname, email, password,
    };

    joi.validate(user, schema.userschema, (err) => {
      if (err) {
        return errorResponse(400, joiFormat(err.message), res);
      }
      return next();
    });
  }

  static validateLogin(req, res, next) {
    const {
      email, password,
    } = req.body;

    const user = {
      email, password,
    };

    joi.validate(user, schema.loginschema, (err) => {
      if (err) {
        return errorResponse(400, joiFormat(err.message), res);
      }
      return next();
    });
  }

  static validateMessage(req, res, next) {
    const {
      subject, message, parentMessageId, status, receiverEmail,
    } = req.body;

    const newMessage = {
      subject, message, parentMessageId, status, receiverEmail,
    };

    joi.validate(newMessage, schema.messageschema, (err) => {
      if (err) {
        return errorResponse(400, joiFormat(err.message), res);
      }
      return next();
    });
  }

  static validateProfile(req, res, next) {
    const {
      firstname, lastname,
    } = req.body;
    const updateuser = {
      firstname, lastname,
    };

    joi.validate(updateuser, schema.profileschema, (err) => {
      if (err) {
        return errorResponse(400, joiFormat(err.message), res);
      }
      return next();
    });
  }

  static validateNewGroup(req, res, next) {
    const { name } = req.body;
    joi.validate({ name }, schema.groupschema, (err) => {
      if (err) {
        return errorResponse(400, joiFormat(err.message), res);
      }
      return next();
    });
  }

  static validateUpdateGroup(req, res, next) {
    const { name } = req.body;
    const groupId = req.params.id;
    joi.validate({ name, groupId }, schema.updategroupschema, (err) => {
      if (err) {
        return errorResponse(400, joiFormat(err.message), res);
      }
      return next();
    });
  }

  static validateJustId(req, res, next) {
    const { id } = req.params;
    joi.validate({ id }, schema.onlyIdSchema, (err) => {
      if (err) {
        return errorResponse(400, joiFormat(err.message), res);
      }
      return next();
    });
  }

  static validateUserDelete(req, res, next) {
    const { groupId } = req.params;
    const userId = req.params.userToDeleteId;
    joi.validate({ groupId, userId }, schema.userDelete, (err) => {
      if (err) {
        return errorResponse(400, joiFormat(err.message), res);
      }
      return next();
    });
  }

  static validateGroupMsg(req, res, next) {
    const {
      subject, message,
      parentMessageId,
    } = req.body;
    const { groupId } = req.params;
    const newMessage = {
      subject, message, groupId, parentMessageId,
    };

    joi.validate(newMessage, schema.sendgroupmsg, (err) => {
      if (err) {
        return errorResponse(400, joiFormat(err.message), res);
      }
      return next();
    });
  }

  static validateAddGroupUsers(req, res, next) {
    const {
      email,
    } = req.body;
    const { groupId } = req.params;
    const newMessage = {
      email, groupId,
    };
    joi.validate(newMessage, schema.addGroupUsers, (err) => {
      if (err) {
        return errorResponse(400, joiFormat(err.message), res);
      }
      return next();
    });
  }
}

export default Validate;
