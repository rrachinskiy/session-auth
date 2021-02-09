import { Router } from 'express';
import { auth } from '../../controllers/auth';

const authRouter = Router();

authRouter.post('/auth', auth);

export default authRouter;
