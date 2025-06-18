import { Request, Response } from 'express';
import JournalEntry from '../models/journalEntryModel';
import Quote from '../models/quoteModel';

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const createJournalEntry = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { journal_text, quote_id } = req.body;
    const userId = req.userId;

    if (!journal_text || !quote_id) {
      res.status(400).json({ message: 'Missing journal text or quote.' });
      return;
    }

    const today = new Date().toISOString().split('T')[0];

    const entry = await JournalEntry.create({
      journal_text,
      quote_id,
      user_id: userId as string,
      date: today,
    });

    res.status(201).json({ message: 'Journal entry saved.', entry });
  } catch (error) {
    console.error('Error saving journal entry:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

export const getUserJournalHistoryRecentFive = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
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

export const getUserJournalHistoryByMonth = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
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

    const grouped: Record<string, typeof entries> = {};

    entries.forEach((entry) => {
      const date = new Date(entry.createdAt as Date);
      const key = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;

      if (!grouped[key]) {
        grouped[key] = [];
      }

      grouped[key].push(entry);
    });

    res.status(200).json(grouped);
  } catch (error) {
    console.error('Error grouping journal entries by month:', error);
    res.status(500).json({ message: 'Could not retrieve entries grouped by month.' });
  }
};

export const updateJournalEntry = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { journal_text, date } = req.body;
    const userId = req.userId;

    if (!journal_text || !date) {
      res.status(400).json({ message: 'Missing updated journal text or date.' });
      return;
    }

    const entry = await JournalEntry.findOne({
      where: {
        user_id: userId,
        date,
      },
    });

    if (!entry) {
      res.status(404).json({ message: 'Entry not found for this date.' });
      return;
    }

    entry.journal_text = journal_text;
    await entry.save();

    res.status(200).json({ message: 'Journal entry updated.', entry });
  } catch (error) {
    console.error('Error updating journal entry:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

export const getTodaysEntry = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
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
      res.status(404).json({ message: 'No entry found for today.' });
      return;
    }

    res.status(200).json(entry);
  } catch (error) {
    console.error("Error fetching today's entry:", error);
    res.status(500).json({ message: 'Server error.' });
  }
};