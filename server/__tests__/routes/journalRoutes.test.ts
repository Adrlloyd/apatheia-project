import request from 'supertest';
import app from '../../src/app';
import JournalEntry from '../../src/models/journalEntryModel';

jest.mock('../../src/middleware/verifyToken', () => {
  return jest.fn((req, res, next) => {
    req.userId = '1';
    next();
  });
});

describe('Journal Routes Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/journal', () => {
    it('should return 400 if journal_text or quote_id is missing', async () => {
      const response = await request(app)
        .post('/api/journal')
        .send({ journal_text: '', quote_id: '' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Missing journal text or quote.');
    });

    it('should return 201 when journal entry is created', async () => {
      jest.spyOn(JournalEntry, 'create').mockResolvedValueOnce({
        id: 1,
        journal_text: 'Reflection content',
        quote_id: 1,
        user_id: '1',
        date: '2025-06-19',
      } as any);

      const response = await request(app)
        .post('/api/journal')
        .send({ journal_text: 'Reflection content', quote_id: 1 });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Journal entry saved.');
    });
  });

  describe('GET /api/journal/recent', () => {
    it('should return 200 with recent journal entries', async () => {
      jest.spyOn(JournalEntry, 'findAll').mockResolvedValueOnce([
        { id: 1, journal_text: 'Note A' },
      ] as any);

      const response = await request(app).get('/api/journal/recent');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /api/journal/by-month', () => {
    it('should return 200 with grouped journal entries', async () => {
      jest.spyOn(JournalEntry, 'findAll').mockResolvedValueOnce([
        {
          id: 1,
          createdAt: new Date('2025-06-01T12:00:00Z'),
          journal_text: 'Grouped',
        },
      ] as any);

      const response = await request(app).get('/api/journal/by-month');

      expect(response.status).toBe(200);
      expect(typeof response.body).toBe('object');
    });
  });

  describe('PUT /api/journal/update', () => {
    it('should return 400 if journal_text or date is missing', async () => {
      const response = await request(app)
        .put('/api/journal/update')
        .send({ journal_text: '', date: '' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Missing updated journal text or date.');
    });

    it('should return 404 if entry not found for date', async () => {
      jest.spyOn(JournalEntry, 'findOne').mockResolvedValueOnce(null);

      const response = await request(app)
        .put('/api/journal/update')
        .send({ journal_text: 'Updated', date: '2025-06-19' });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Entry not found for this date.');
    });

    it('should return 200 when journal entry is updated', async () => {
      const mockEntry = {
        journal_text: 'Old',
        save: jest.fn().mockResolvedValue(undefined),
      };

      jest.spyOn(JournalEntry, 'findOne').mockResolvedValueOnce(mockEntry as any);

      const response = await request(app)
        .put('/api/journal/update')
        .send({ journal_text: 'Updated Note', date: '2025-06-19' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Journal entry updated.');
    });
  });

  describe('GET /api/journal/today', () => {
    it("should return 404 if no entry found for today's date", async () => {
      jest.spyOn(JournalEntry, 'findOne').mockResolvedValueOnce(null);

      const response = await request(app).get('/api/journal/today');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('No entry found for today.');
    });

    it("should return 200 with today's journal entry", async () => {
      jest.spyOn(JournalEntry, 'findOne').mockResolvedValueOnce({
        id: 1,
        journal_text: "Today's note",
        quote_id: 1,
        Quote: { quote_text: 'Stoic quote', author: 'Seneca' },
      } as any);

      const response = await request(app).get('/api/journal/today');

      expect(response.status).toBe(200);
      expect(response.body.journal_text).toBe("Today's note");
    });
  });
});