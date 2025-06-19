import { generateDeepQuestion } from '../../src/controllers/openaiController';
import { Request, Response } from 'express';

describe('generateDeepQuestion', () => {
  let request: Partial<Request>;
  let response: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });

    request = {
      body: { journalText: 'Today I faced a difficult situation.' },
    };

    response = {
      status: statusMock,
    };

    jest.clearAllMocks();
  });

  it('should return a mock reflection question with 200', async () => {
    await generateDeepQuestion(request as Request, response as Response);

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      question: expect.stringContaining('control'),
    });
  });
});