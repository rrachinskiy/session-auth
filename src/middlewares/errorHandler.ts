import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../types';

export const errorHandler = (
  error: HttpError,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
};
