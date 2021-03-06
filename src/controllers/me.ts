import { Request, Response, NextFunction } from 'express';
import { User } from '../entities/User';

export const me = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.session.userId;
    if (!userId) {
      const error = new Error('Unathorized');
      error.status = 401;
      throw error;
    }
    const user = await User.findOne(userId);

    res.json({
      username: user?.username,
    });
  } catch (err) {
    next(err);
  }
};
