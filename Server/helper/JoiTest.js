import joi from 'joi';
import errorResponse from './errorResponse';

const joiFormat = (error) => {
  let format = error;
  format = format.slice(format.indexOf('[') + 1, format.indexOf(']'));
  format = format.replace(/"/gi, '');
  return format;
};

const JoiTest = (testObj, schemaObj, res, next) => {
  joi.validate(testObj, schemaObj, (err) => {
    if (err) {
      return errorResponse(400, joiFormat(err.message), res);
    }
    return next();
  });
};

export default JoiTest;
