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

  profileschema:
  Joi.object().keys({
    firstname: Joi.string().trim().min(3).optional(),
    lastname: Joi.string().trim().min(3).optional(),
  }),

  groupschema:
  Joi.object().keys({
    name: Joi.string().trim().min(3).required(),
  }),
};

export default schemas;
