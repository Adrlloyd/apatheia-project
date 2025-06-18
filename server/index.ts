import dotenv from 'dotenv';
import express, { Application } from 'express';
import cors from 'cors';
dotenv.config();

import connectDB from './models/db';
import { User, Quote, JournalEntry } from './models/associateModels';
import authRoutes from './routes/authRoutes';
import quoteRoutes from './routes/quotesRoute';
import journalRoutes from './routes/journalRoutes';
import userRoutes from './routes/userRoutes';
import openapiRoutes from './routes/openaiRoute';


const app: Application = express();

app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api/quote', quoteRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/users', userRoutes);
app.use('/api/openai', openapiRoutes);

app.listen(3000, async () => {
  try {
    await connectDB();
    await User.sync();
    await Quote.sync();
    await JournalEntry.sync();
    console.log('Server running Λ');
  } catch (error) {
    console.error('Failed to connect to DB:', error);
    process.exit(1);
  }
});