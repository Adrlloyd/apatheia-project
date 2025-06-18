import User from './userModel';
import Quote from './quoteModel';
import JournalEntry from './journalEntryModel';

// User <-> JournalEntry
User.hasMany(JournalEntry, { foreignKey: 'user_id', onDelete: 'CASCADE' });
JournalEntry.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });

// Quote <-> JournalEntry
Quote.hasMany(JournalEntry, { foreignKey: 'quote_id' });
JournalEntry.belongsTo(Quote, { foreignKey: 'quote_id' });

export { User, Quote, JournalEntry };
