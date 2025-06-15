const Quote = require('../models/quoteModel');

exports.getAQuote = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const quote = await Quote.findOne({ where: { assigned_date: today } });

    if (!quote) {
      return res.status(404).json({ message: 'No quote found for today.' });
    }

    res.json(quote);
  } catch (error) {
    console.error('Error getting quote', error);
    res.status(500).send('Error while getting quote');
  }
};