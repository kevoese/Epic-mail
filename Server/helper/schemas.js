import Joi from 'joi';

const schemas = {
  userschema:
    Joi.object().keys({
      firstname: Joi.string().trim().min(3).required(),
      lastname: Joi.string().trim().min(3).required(),
      email: Joi.string().email().lowercase().required(),
      password: Joi.string().min(6).required(),
    }),

  loginschema:
    Joi.object().keys({
      email: Joi.string().email().lowercase().required(),
      password: Joi.string().required(),
    }),

  messageschema:
  Joi.object().keys({
    subject: Joi.string().required(),
    message: Joi.string().required(),
    parentMessageId: Joi.number().integer().optional(),
    receiverEmail: Joi.string().email().lowercase().required(),
    status: Joi.string().regex(/^sent$|^draft$/),
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
