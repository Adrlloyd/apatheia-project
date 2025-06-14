const JournalEntry = require('../models/journalEntryModel');
const Quote = require('../models/quoteModel');

exports.createJournalEntry = async (req, res) => {
  try {
    const { journal_text, quote_id } = req.body;
    const userId = req.userId;

    if (!journal_text || !quote_id) {
      return res
        .status(400)
        .json({ message: 'Missing journal text or quote.' });
    }

    const today = new Date().toISOString().split('T')[0];

    const entry = await JournalEntry.create({
      journal_text,
      quote_id,
      user_id: userId,
      date: today,
    });

    res.status(201).json({ message: 'Journal entry saved.', entry });
  } catch (error) {
    console.error('Error saving journal entry:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.getUserJournalHistoryRecentFive = async (req, res) => {
  try {
    const userId = req.userId;

    const entries = await JournalEntry.findAll({
      where: { user_id: userId },
      include: {
        model: Quote,
        attributes: ['quote_text', 'author'],
      },
      order: [['createdAt', 'DESC']],
      limit: 5,
    });

    res.status(200).json(entries);
  } catch (error) {
    console.error('Error fetching recent journal entries:', error);
    res.status(500).json({ message: 'Could not retrieve recent entries.' });
  }
};

exports.getUserJournalHistoryByMonth = async (req, res) => {
  try {
    const userId = req.userId;

    const entries = await JournalEntry.findAll({
      where: { user_id: userId },
      include: {
        model: Quote,
        attributes: ['quote_text', 'author'],
      },
      order: [['createdAt', 'DESC']],
    });

    const grouped = {};

    entries.forEach((entry) => {
      const date = new Date(entry.createdAt);
      const key = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;

      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(entry);
    });

    res.status(200).json(grouped);
  } catch (error) {
    console.error('Error grouping journal entries by month:', error);
    res
      .status(500)
      .json({ message: 'Could not retrieve entries grouped by month.' });
  }
};

exports.updateJournalEntry = async (req, res) => {
  try {
    const { journal_text, date } = req.body;
    const userId = req.userId;

    if (!journal_text || !date) {
      return res
        .status(400)
        .json({ message: 'Missing updated journal text or date.' });
    }

    const entry = await JournalEntry.findOne({
      where: {
        user_id: userId,
        date,
      },
    });

    if (!entry) {
      return res
        .status(404)
        .json({ message: 'Entry not found for this date.' });
    }

    entry.journal_text = journal_text;
    await entry.save();

    res.status(200).json({ message: 'Journal entry updated.', entry });
  } catch (error) {
    console.error('Error updating journal entry:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.getTodaysEntry = async (req, res) => {
  try {
    const userId = req.userId;
    const today = new Date().toISOString().split('T')[0];

    const entry = await JournalEntry.findOne({
      where: {
        user_id: userId,
        date: today,
      },
      include: {
        model: Quote,
        attributes: ['quote_text', 'author'],
      },
    });

    if (!entry) {
      return res.status(404).json({ message: 'No entry found for today.' });
    }

    res.status(200).json(entry);
  } catch (error) {
    console.error("Error fetching today's entry:", error);
    res.status(500).json({ message: 'Server error.' });
  }
};