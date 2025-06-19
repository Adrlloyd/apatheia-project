import express, { Application } from 'express';
import cors from 'cors';

import './models/associateModels';
import authRoutes from './routes/authRoutes';
import quoteRoutes from './routes/quoteRoute';
import journalRoutes from './routes/journalRoutes';
import userRoutes from './routes/userRoutes';
import openaiRoutes from './routes/openaiRoute';

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api/quote', quoteRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/users', userRoutes);
app.use('/api/openai', openaiRoutes);

export default app;