import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import OpenAIInput from 'src/components/OpenAIInput';

import { fetchDeepQuestion } from 'src/services/openaiService';
import * as storageUtils from 'src/utils/storageUtils';

jest.mock('src/services/openaiService', () => ({
  fetchDeepQuestion: jest.fn(),
}));

jest.mock('src/utils/storageUtils', () => ({
  getQuestionForToday: jest.fn(),
  setQuestionForToday: jest.fn(),
}));

describe('OpenAIInput', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders saved question from storage and hides button', () => {
    storageUtils.getQuestionForToday.mockReturnValue('Saved deep question');
    
    render(<OpenAIInput journalText="Test journal" />);

    expect(screen.getByText('Saved deep question')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /explore this concept/i })).not.toBeInTheDocument();
  });

  it('renders button if no stored question exists', () => {
    storageUtils.getQuestionForToday.mockReturnValue(null);

    render(<OpenAIInput journalText="Test journal" />);

    expect(screen.getByRole('button', { name: /explore this concept/i })).toBeInTheDocument();
  });

  it('fetches question on button click and shows it', async () => {
    storageUtils.getQuestionForToday.mockReturnValue(null);
    fetchDeepQuestion.mockResolvedValue('Generated deep question');

    render(<OpenAIInput journalText="Test entry" />);

    fireEvent.click(screen.getByRole('button', { name: /explore this concept/i }));

    expect(screen.getByText(/generating stoic question/i)).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.getByText('Generated deep question')).toBeInTheDocument()
    );

    expect(fetchDeepQuestion).toHaveBeenCalledWith('Test entry');
    expect(storageUtils.setQuestionForToday).toHaveBeenCalledWith('Generated deep question');
  });

  it('does not crash if fetchDeepQuestion returns null', async () => {
    storageUtils.getQuestionForToday.mockReturnValue(null);
    fetchDeepQuestion.mockResolvedValue(null);

    render(<OpenAIInput journalText="Anything" />);

    fireEvent.click(screen.getByRole('button', { name: /explore this concept/i }));

    await waitFor(() => {
      expect(screen.queryByText(/generating stoic question/i)).not.toBeInTheDocument();
    });

    expect(screen.queryByText('Anything')).not.toBeInTheDocument();
  });
});