import Joi from 'joi';

const schemas = {
  userschema:
    Joi.object().keys({
      firstname: Joi.string().trim().min(3).required(),
      lastname: Joi.string().trim().min(3).required(),
      email: Joi.string().email().lowercase().required(),
      password: Joi.required(),
    }),
};

export default schemas;
