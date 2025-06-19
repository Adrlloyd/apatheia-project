import { getAQuote } from '../../src/controllers/quoteController';
import { Request, Response } from 'express';
import Quote from '../../src/models/quoteModel';

jest.mock('../../src/models/quoteModel');

describe('getAQuote', () => {
  let request: Partial<Request>;
  let response: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;
  let sendMock: jest.Mock;

  beforeEach(() => {
    statusMock = jest.fn().mockReturnValue({
      json: jest.fn(),
      send: jest.fn(),
    });

    jsonMock = statusMock().json;
    sendMock = statusMock().send;

    request = {};
    response = {
      status: statusMock,
      json: jsonMock,
      send: sendMock,
    };

    jest.clearAllMocks();
  });

  it('should return todays quote if found', async () => {
    const mockQuote = { id: 1, quote_text: 'Test quote', assigned_date: '2024-06-19' };
    (Quote.findOne as jest.Mock).mockResolvedValue(mockQuote);

    await getAQuote(request as Request, response as Response);

    expect(Quote.findOne).toHaveBeenCalledWith({
      where: { assigned_date: expect.any(String) },
    });
    expect(jsonMock).toHaveBeenCalledWith(mockQuote);
  });

  it('should return 404 if no quote found', async () => {
    (Quote.findOne as jest.Mock).mockResolvedValue(null);

    await getAQuote(request as Request, response as Response);

    expect(statusMock).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({
      message: 'No quote found for today.',
    });
  });

  it('should return 500 if error is thrown', async () => {
    const originalConsole = console.error;
    console.error = jest.fn();

    (Quote.findOne as jest.Mock).mockRejectedValue(new Error('DB error'));

    await getAQuote(request as Request, response as Response);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(sendMock).toHaveBeenCalledWith('Error while getting quote');

    console.error = originalConsole;
  });
});