import { Request, Response } from 'express';
import Quote from '../models/quoteModel';

export const getAQuote = async (req: Request, res: Response): Promise<void> => {
  try {
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

    const quote = await Quote.findOne({ where: { assigned_date: today } });

    if (!quote) {
      res.status(404).json({ message: 'No quote found for today.' });
      return;
    }

    res.json(quote);
  } catch (error) {
    console.error('Error getting quote:', error);
    res.status(500).send('Error while getting quote');
  }
};