import argon2 from 'argon2';
import { NextFunction, Request, Response } from 'express';
import { User } from '../entities/User';

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const credentials = {
    username: req.body.username,
    password: req.body.password,
  };

  try {
    const existingUser = await User.findOne({ where: { username: credentials.username } });
    if (!existingUser) {
      const error = new Error('User does not exist');
      error.status = 400;
      error.field = 'username';
      throw error;
    }

    const validPassword = await argon2.verify(existingUser.password, credentials.password);
    if (!validPassword) {
      const error = new Error('Password is not correct');
      error.status = 400;
      error.field = 'password';
      throw error;
    }

    req.session.userId = existingUser.id;
    res.json({
      success: true,
      username: existingUser.username,
    });
  } catch (err) {
    next(err);
  }
};
