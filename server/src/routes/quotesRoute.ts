import { Router } from 'express';
import { getAQuote } from '../controllers/quotesController';

const router: Router = Router();

router.get('/', getAQuote);

export default router;