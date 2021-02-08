import argon2 from 'argon2';
import { NextFunction, Request, Response } from 'express';
import { HttpError } from 'src/types';
import User from '../models/User';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  const hashedPassword = await argon2.hash(req.body.password);

  const credentials = {
    username: req.body.username,
    password: hashedPassword,
  };
  try {
    const user = new User(credentials);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User has been registered',
    });
  } catch (err) {
    if (err?.code === 11000) {
      const duplUsernameError: HttpError = new Error('This username is already taken');
      duplUsernameError.status = 400;
      return next(duplUsernameError);
    }
    next(err);
  }
};
