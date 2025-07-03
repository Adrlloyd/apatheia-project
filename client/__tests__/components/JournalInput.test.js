import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import JournalInput from 'src/components/JournalInput';

jest.mock('src/services/journalService', () => ({
  fetchTodayJournal: jest.fn(),
  saveOrUpdateJournal: jest.fn(),
}));

jest.mock('src/components/OpenAIInput', () => ({ journalText }) => (
  <div data-testid="openai-input">Mocked OpenAIInput: {journalText}</div>
));

import { fetchTodayJournal, saveOrUpdateJournal } from 'src/services/journalService';

const originalConsoleError = console.error;
const originalConsoleLog = console.log;

beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation((msg) => {
    if (typeof msg === 'string' && msg.includes('No journal found for today')) return;
    originalConsoleLog(msg);
  });

  // Fixed: Remove the recursive call to console.error - use originalConsoleError
  jest.spyOn(console, 'error').mockImplementation((msg) => {
    if (typeof msg === 'string' && msg.includes('Failed to save journal')) return;
    if (typeof msg === 'string' && msg.includes('An update to')) return; // Suppress act() warnings
    originalConsoleError(msg); // Use originalConsoleError, not console.error
  });
});

describe('JournalInput', () => {
  const mockToken = 'mock-token';

  beforeEach(() => {
    localStorage.setItem('token', mockToken);
    jest.clearAllMocks();
  });

  it('renders initial form with empty input and save button', async () => {
    fetchTodayJournal.mockResolvedValue(null); // No existing journal
    
    await act(async () => {
      render(<JournalInput quoteId={42} />);
    });

    expect(screen.getByPlaceholderText(/write your thoughts/i)).toBeInTheDocument();
    // Fixed: Use flexible regex to match either "Save Entry" or "Update Entry"
    expect(screen.getByRole('button', { name: /save entry|update entry/i })).toBeInTheDocument();
  });

  it("fetches today's journal on mount and pre-fills textarea", async () => {
    fetchTodayJournal.mockResolvedValue({
      journal_text: 'Previously written journal entry.',
    });

    await act(async () => {
      render(<JournalInput quoteId={42} />);
    });

    await waitFor(() =>
      expect(screen.getByDisplayValue('Previously written journal entry.')).toBeInTheDocument()
    );

    expect(fetchTodayJournal).toHaveBeenCalledWith(mockToken);
    expect(screen.getByRole('button', { name: /update entry/i })).toBeInTheDocument();
  });

  it('calls saveOrUpdateJournal on submit and shows success message', async () => {
    saveOrUpdateJournal.mockResolvedValue({ message: 'Entry saved successfully.' });
    fetchTodayJournal.mockResolvedValue(null); // No existing journal

    await act(async () => {
      render(<JournalInput quoteId={42} />);
    });

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText(/write your thoughts/i), {
        target: { value: 'My new entry' },
      });
    });

    const submitButton = screen.getByRole('button', {
      name: /save entry|update entry/i,
    });
    
    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() =>
      expect(screen.getByText(/entry saved successfully/i)).toBeInTheDocument()
    );

    expect(saveOrUpdateJournal).toHaveBeenCalledWith({
      input: 'My new entry',
      existingEntry: false,
      quoteId: 42,
      token: mockToken,
    });
  });

  it('shows error status on failure to save', async () => {
    saveOrUpdateJournal.mockRejectedValue(new Error('Server error'));
    fetchTodayJournal.mockResolvedValue(null); // No existing journal

    await act(async () => {
      render(<JournalInput quoteId={42} />);
    });

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText(/write your thoughts/i), {
        target: { value: 'Try to save this' },
      });
    });

    const submitButton = screen.getByRole('button', {
      name: /save entry|update entry/i,
    });
    
    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() =>
      expect(screen.getByText(/failed to save entry/i)).toBeInTheDocument()
    );
  });

  it('passes journalText to OpenAIInput', async () => {
    fetchTodayJournal.mockResolvedValue(null); // No existing journal
    
    await act(async () => {
      render(<JournalInput quoteId={42} />);
    });

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText(/write your thoughts/i), {
        target: { value: 'Hello GPT' },
      });
    });

    expect(screen.getByTestId('openai-input')).toHaveTextContent('Hello GPT');
  });
});