import argon2 from 'argon2';
import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../types';
import User from '../models/User';

export const auth = async (
  req: Request & { session: { username: string } },
  res: Response,
  next: NextFunction,
) => {
  const credentials = {
    username: req.body.username,
    password: req.body.password,
  };

  try {
    const existingUser: any = await User.findOne({ username: credentials.username });
    if (!existingUser) {
      const error: HttpError = new Error('User does not exist');
      error.status = 400;
      error.field = 'username';
      throw error;
    }

    const validPassword = await argon2.verify(existingUser.password, credentials.password);
    if (!validPassword) {
      const error: HttpError = new Error('Password is not correct');
      error.status = 400;
      error.field = 'password';
      throw error;
    }

    req.session.username = existingUser.username;
    res.json({
      success: true,
      username: existingUser.username,
    });
  } catch (err) {
    next(err);
  }
};
