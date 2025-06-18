import bcrypt from 'bcryptjs';
import sequelize from '../models/dbInstance';
import User from '../models/userModel';
import Quote from '../models/quoteModel';
import JournalEntry from '../models/journalEntryModel';

/**
 * Seeds the database with a test user, quotes, and journal entries.
 */
async function seed(): Promise<void> {
  try {
    await sequelize.sync({ force: true });

    // Create test user
    const hashedPassword = await bcrypt.hash('testpassword', 10);
    const testUser = await User.create({
      name: 'Test User',
      username: 'testuser',
      password_hash: hashedPassword,
    });

    // Generate dates relative to today
    const today = new Date();
    const formatDate = (d: Date): string => d.toISOString().split('T')[0];
    const dates: string[] = [
      formatDate(new Date(today.getTime() - 3 * 86400000)), // 3 days ago
      formatDate(new Date(today.getTime() - 2 * 86400000)), // 2 days ago
      formatDate(new Date(today.getTime() - 1 * 86400000)), // yesterday
      formatDate(today),                                    // today
      formatDate(new Date(today.getTime() + 1 * 86400000)), // tomorrow
    ];

    // Seed quotes
    const quotes = await Quote.bulkCreate([
      { quote_text: 'He who angers you conquers you.', author: 'Epictetus', assigned_date: dates[0] },
      { quote_text: 'The best revenge is not to be like your enemy.', author: 'Marcus Aurelius', assigned_date: dates[1] },
      { quote_text: 'No man is free who is not master of himself.', author: 'Epictetus', assigned_date: dates[2] },
      { quote_text: 'We suffer more in imagination than in reality.', author: 'Seneca', assigned_date: dates[3] },
      { quote_text: 'Man conquers the world by conquering himself.', author: 'Zeno', assigned_date: dates[4] },
    ]);

    // Add journal entries for first three
    await JournalEntry.bulkCreate([
      { journal_text: 'This really resonated with me.', user_id: testUser.id, quote_id: quotes[0].id, date: dates[0] },
      { journal_text: 'Trying not to stoop whenever I can.', user_id: testUser.id, quote_id: quotes[1].id, date: dates[1] },
      { journal_text: 'Self-control by self-reflection.', user_id: testUser.id, quote_id: quotes[2].id, date: dates[2] },
    ]);

    console.log('✅ Seed data created successfully.');
    process.exit();
  } catch (err) {
    console.error('❌ Error seeding database:', err);
    process.exit(1);
  }
}

seed();