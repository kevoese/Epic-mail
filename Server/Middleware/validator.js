import joi from 'joi';
import schema from '../helper/schemas';

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
        return res.status(400).json({
          status: 400,
          error: err,
        });
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
        return res.status(400).json({
          status: 400,
          error: err,
        });
      }
      return next();
    });
  }
}

export default Validate;
