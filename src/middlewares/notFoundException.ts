import { NextFunction, Request, Response } from 'express';

export const notFoundException = (_: Request, __: Response, next: NextFunction) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
};
