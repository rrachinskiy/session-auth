import { Router } from 'express';
import { auth } from '../../controllers/auth';

const authRouter = Router();

// @ts-ignore
authRouter.post('/auth', auth);

export default authRouter;
