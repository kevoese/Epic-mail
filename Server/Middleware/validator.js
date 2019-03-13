import joi from 'joi';
import schema from '../helper/schemas';
import errorResponse from '../helper/errorResponse';

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
        return errorResponse(400, err, res);
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
        return errorResponse(400, err, res);
      }
      return next();
    });
  }

  static validateMessage(req, res, next) {
    const {
      subject, message, parentMessageId, status, senderId, receiverId,
    } = req.body;

    const newMessage = {
      subject, message, parentMessageId, status, senderId, receiverId,
    };

    joi.validate(newMessage, schema.messageschema, (err) => {
      if (err) {
        return errorResponse(400, err, res);
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
        return errorResponse(400, err, res);
      }
      return next();
    });
  }
}

export default Validate;
