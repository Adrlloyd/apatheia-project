import { Router } from 'express';
import {
  createJournalEntry,
  updateJournalEntry,
  getTodaysEntry,
  getUserJournalHistoryRecentFive,
  getUserJournalHistoryByMonth,
} from '../controllers/journalController';
import verifyToken from '../middleware/verifyToken';

const router: Router = Router();

router.post('/', verifyToken, createJournalEntry);
router.get('/recent', verifyToken, getUserJournalHistoryRecentFive);
router.get('/by-month', verifyToken, getUserJournalHistoryByMonth);
router.put('/update', verifyToken, updateJournalEntry);
router.get('/today', verifyToken, getTodaysEntry);

export default router;