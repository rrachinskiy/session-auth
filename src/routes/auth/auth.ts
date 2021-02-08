import { Router } from 'express';

const authRouter = Router();

authRouter.get('/auth', (_, res) => {
  res.send('Auth');
});

export default authRouter;
