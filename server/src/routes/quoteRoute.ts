import { Router } from 'express';
import { getAQuote } from '../controllers/quoteController';

const router: Router = Router();

router.get('/', getAQuote);

export default router;