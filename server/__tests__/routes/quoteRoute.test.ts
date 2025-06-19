import request from 'supertest';
import app from '../../src/app';
import Quote from '../../src/models/quoteModel';

describe('Quote Routes Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/quote', () => {
    it('should return 200 with today\'s quote', async () => {
      const today = new Date().toISOString().split('T')[0];

      jest.spyOn(Quote, 'findOne').mockResolvedValueOnce({
        id: 1,
        quote: 'Only the educated are free.',
        assigned_date: today,
      } as any);

      const response = await request(app).get('/api/quote');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: 1,
        quote: 'Only the educated are free.',
        assigned_date: today,
      });
    });

    it('should return 404 if no quote is found', async () => {
      jest.spyOn(Quote, 'findOne').mockResolvedValueOnce(null);

      const response = await request(app).get('/api/quote');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('No quote found for today.');
    });

    it('should return 500 if an error occurs', async () => {
      jest.spyOn(Quote, 'findOne').mockRejectedValueOnce(new Error('DB error'));

      const response = await request(app).get('/api/quote');

      expect(response.status).toBe(500);
      expect(response.text).toBe('Error while getting quote');
    });
  });
});
