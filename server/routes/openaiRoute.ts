import { Router } from 'express';
import { generateDeepQuestion } from '../controllers/openaiController';

const router: Router = Router();

router.post('/question', generateDeepQuestion);

export default router;