import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  res.status(error.status || 500);
  res.json({
    errors: [
      {
        message: error.message,
        field: error?.field,
      },
    ],
  });
};
