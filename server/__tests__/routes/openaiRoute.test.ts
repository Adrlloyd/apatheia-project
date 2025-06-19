import request from 'supertest';
import app from '../../src/app';

describe('OpenAI Route Integration', () => {
  describe('POST /api/openai/question', () => {
    it('should return 200 with a mocked deep question', async () => {
      const response = await request(app)
        .post('/api/openai/question')
        .send({ journalText: 'I was frustrated today but tried to remain calm.' });

      expect(response.status).toBe(200);
      expect(response.body.question).toBe(
        'How might this situation look different if you focused only on what is within your control?'
      );
    });
  });
});