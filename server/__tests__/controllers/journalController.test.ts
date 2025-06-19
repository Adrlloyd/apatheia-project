import {
  createJournalEntry,
  getUserJournalHistoryRecentFive,
  getUserJournalHistoryByMonth,
  updateJournalEntry,
  getTodaysEntry,
} from '../../src/controllers/journalController';
import { Request, Response } from 'express';
import JournalEntry from '../../src/models/journalEntryModel';

interface AuthenticatedRequest extends Request {
  userId?: string;
}

jest.mock('../../src/models/journalEntryModel');
jest.mock('../../src/models/quoteModel');

describe('journalController', () => {
  let request: Partial<AuthenticatedRequest>;
  let response: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    statusMock = jest.fn().mockReturnValue({ json: jest.fn() });
    jsonMock = statusMock().json;

    request = { body: {}, userId: '123' };
    response = { status: statusMock };

    jest.clearAllMocks();
  });

  describe('createJournalEntry', () => {
    it('should return 400 if journal_text or quote_id is missing', async () => {
      request.body = { journal_text: '', quote_id: '' };

      await createJournalEntry(request as any, response as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Missing journal text or quote.' });
    });

    it('should save and return new journal entry', async () => {
      request.body = { journal_text: 'Test entry', quote_id: '456' };
      (JournalEntry.create as jest.Mock).mockResolvedValue({ id: 1, journal_text: 'Test entry' });

      await createJournalEntry(request as any, response as Response);

      expect(JournalEntry.create).toHaveBeenCalledWith(expect.objectContaining({
        journal_text: 'Test entry',
        quote_id: '456',
        user_id: '123',
      }));
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Journal entry saved.',
        entry: { id: 1, journal_text: 'Test entry' },
      });
    });

    it('should return 500 if an error occurs', async () => {
      (JournalEntry.create as jest.Mock).mockRejectedValue(new Error('DB error'));
      request.body = { journal_text: 'Fail', quote_id: '456' };

      await createJournalEntry(request as any, response as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Server error.' });
    });
  });

  describe('getUserJournalHistoryRecentFive', () => {
    it('should return 200 with recent entries', async () => {
      (JournalEntry.findAll as jest.Mock).mockResolvedValue(['entry1', 'entry2']);

      await getUserJournalHistoryRecentFive(request as any, response as Response);

      expect(JournalEntry.findAll).toHaveBeenCalledWith(expect.objectContaining({
        where: { user_id: '123' },
        limit: 5,
      }));
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(['entry1', 'entry2']);
    });

    it('should return 500 if error occurs', async () => {
      (JournalEntry.findAll as jest.Mock).mockRejectedValue(new Error('Fail'));

      await getUserJournalHistoryRecentFive(request as any, response as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Could not retrieve recent entries.' });
    });
  });

  describe('getUserJournalHistoryByMonth', () => {
    it('should group entries by month and year', async () => {
      const mockEntries = [
        { createdAt: new Date('2024-05-01'), id: 1 },
        { createdAt: new Date('2024-05-02'), id: 2 },
        { createdAt: new Date('2024-06-01'), id: 3 },
      ];

      (JournalEntry.findAll as jest.Mock).mockResolvedValue(mockEntries);

      await getUserJournalHistoryByMonth(request as any, response as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({
        'May 2024': expect.any(Array),
        'June 2024': expect.any(Array),
      }));
    });

    it('should return 500 on error', async () => {
      (JournalEntry.findAll as jest.Mock).mockRejectedValue(new Error('fail'));

      await getUserJournalHistoryByMonth(request as any, response as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Could not retrieve entries grouped by month.' });
    });
  });

  describe('updateJournalEntry', () => {
    it('should return 400 if journal_text or date is missing', async () => {
      request.body = { journal_text: '', date: '' };

      await updateJournalEntry(request as any, response as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Missing updated journal text or date.' });
    });

    it('should update an existing entry', async () => {
      const mockEntry = { journal_text: '', save: jest.fn() };
      (JournalEntry.findOne as jest.Mock).mockResolvedValue(mockEntry);

      request.body = { journal_text: 'Updated', date: '2024-06-19' };

      await updateJournalEntry(request as any, response as Response);

      expect(mockEntry.journal_text).toBe('Updated');
      expect(mockEntry.save).toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Journal entry updated.',
        entry: mockEntry,
      });
    });

    it('should return 404 if entry not found', async () => {
      (JournalEntry.findOne as jest.Mock).mockResolvedValue(null);

      request.body = { journal_text: 'Nothing', date: '2024-06-19' };

      await updateJournalEntry(request as any, response as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Entry not found for this date.' });
    });

    it('should return 500 on error', async () => {
      (JournalEntry.findOne as jest.Mock).mockRejectedValue(new Error('fail'));
      request.body = { journal_text: 'fail', date: '2024-06-19' };

      await updateJournalEntry(request as any, response as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Server error.' });
    });
  });

  describe('getTodaysEntry', () => {
    it('should return 200 with todays entry', async () => {
      const today = new Date().toISOString().split('T')[0];

      const mockEntry = { id: 1, journal_text: 'Today' };
      (JournalEntry.findOne as jest.Mock).mockResolvedValue(mockEntry);

      await getTodaysEntry(request as any, response as Response);

      expect(JournalEntry.findOne).toHaveBeenCalledWith(expect.objectContaining({
        where: { user_id: '123', date: today },
      }));
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(mockEntry);
    });

    it('should return 404 if no entry is found', async () => {
      (JournalEntry.findOne as jest.Mock).mockResolvedValue(null);

      await getTodaysEntry(request as any, response as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'No entry found for today.' });
    });

    it('should return 500 on error', async () => {
      (JournalEntry.findOne as jest.Mock).mockRejectedValue(new Error('fail'));

      await getTodaysEntry(request as any, response as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Server error.' });
    });
  });
});