import { ValidationError } from 'express-validator';

export interface ValidationErrorParsed {
  statusCode: number;
  message: string;
  nestedErrors: ValidationError[];
}
