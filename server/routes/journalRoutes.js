const express = require('express');
const router = express.Router();
const {
  createJournalEntry,
  updateJournalEntry,
  getTodaysEntry,
  getUserJournalHistoryRecentFive,
  getUserJournalHistoryByMonth,
} = require('../controllers/journalController');
const verifyToken = require('../middleware/verifyToken');

router.post('/', verifyToken, createJournalEntry);
router.get('/recent', verifyToken, getUserJournalHistoryRecentFive);
router.get('/by-month', verifyToken, getUserJournalHistoryByMonth);
router.put('/update', verifyToken, updateJournalEntry);
router.get('/today', verifyToken, getTodaysEntry);

module.exports = router;
