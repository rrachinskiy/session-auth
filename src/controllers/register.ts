import argon2 from 'argon2';
import { NextFunction, Request, Response } from 'express';
import { HttpError } from 'src/types';
// import User from '../models/User';
import { User } from '../entities/User';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  const hashedPassword = await argon2.hash(req.body.password);

  const credentials = {
    username: req.body.username,
    password: hashedPassword,
  };
  try {
    const user = await User.create(credentials).save();

    req.session.userId = user.id;

    res.status(200).json({
      success: true,
      message: 'User has been registered',
      username: credentials.username,
    });
  } catch (err) {
    if (err.code === '23505') {
      const duplUsernameError: HttpError = new Error('This username is already taken');
      duplUsernameError.status = 400;
      duplUsernameError.field = 'username';
      next(duplUsernameError);
    }
  }
};
