const express = require('express');
const router = express.Router();
const { generateDeepQuestion } = require('../controllers/openaiController');

router.post('/question', generateDeepQuestion);

module.exports = router;