import joi from 'joi';
import errorResponse from './errorResponse';

const joiFormat = (error) => {
  const field = error.details[0].context.key;
  if (error.details[0].type === 'string.regex.base') return `wromg input for ${field}`;
  let format = error.message;
  format = format.slice(format.indexOf('[') + 1, format.indexOf(']'));
  format = format.replace(/"/gi, '');
  return format;
};

const JoiTest = (testObj, schemaObj, res, next) => {
  joi.validate(testObj, schemaObj, (err) => {
    if (err) {
      return errorResponse(400, joiFormat(err), res);
    }
    return next();
  });
};

export default JoiTest;
