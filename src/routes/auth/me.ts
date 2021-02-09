import { Router } from 'express';
import { me } from '../../controllers/me';

const meRouter = Router();

meRouter.get('/me', me);

export default meRouter;
