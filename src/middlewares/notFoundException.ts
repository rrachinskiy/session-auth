import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../types';

export const notFoundException = (_: Request, __: Response, next: NextFunction) => {
  const error: HttpError = new Error('Not found');
  error.status = 404;
  next(error);
};
