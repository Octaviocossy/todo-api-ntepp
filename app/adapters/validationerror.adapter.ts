import { ValidationError } from 'express-validator';

import { ValidationErrorParsed } from '../models';

const validationError = (errors: ValidationError[]): ValidationErrorParsed => {
  return {
    statusCode: 400,
    message: 'Bad Request',
    nestedErrors: errors,
  };
};

export default validationError;
