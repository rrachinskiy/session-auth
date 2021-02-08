import { Router } from 'express';

const registerRouter = Router();

registerRouter.get('/register', (_, res) => {
  res.send('Register');
});

export default registerRouter;
