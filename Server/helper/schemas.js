import Joi from 'joi';

const schemas = {
  userschema:
    Joi.object().keys({
      firstname: Joi.string().trim().min(3).required(),
      lastname: Joi.string().trim().min(3).required(),
      email: Joi.string().email().lowercase().required(),
      password: Joi.required(),
    }),

  loginschema:
    Joi.object().keys({
      email: Joi.string().email().lowercase().required(),
      password: Joi.required(),
    }),

  messageschema:
  Joi.object().keys({
    subject: Joi.string().required(),
    message: Joi.string().required(),
    parentMessageId: Joi.number().integer().required(),
    receiverId: Joi.number().integer().required(),
    senderId: Joi.number().integer().required(),
    status: Joi.string().min(3).max(7).required(),
  }),
};

export default schemas;
