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
    name: Joi.string().trim().required(),
  }),

  updategroupschema:
  Joi.object().keys({
    name: Joi.string().trim().min(3).required(),
    groupId: Joi.number().integer().required(),
  }),

  sendgroupmsg:
  Joi.object().keys({
    subject: Joi.string().required(),
    message: Joi.string().required(),
    groupId: Joi.number().integer().required(),
    parentMessageId: Joi.number().integer().optional(),
  }),

  addGroupUsers:
  Joi.object().keys({
    groupId: Joi.number().integer().required(),
    email: Joi.string().email().lowercase().required(),
  }),

  onlyIdSchema:
  Joi.object().keys({
    id: Joi.number().integer().required(),
  }),

  userDelete:
  Joi.object().keys({
    groupId: Joi.number().integer().required(),
    userId: Joi.number().integer().required(),
  }),
};

export default schemas;
