import { render, screen, fireEvent } from '@testing-library/react';
import ArchiveEntry from '../../src/components/ArchiveEntry';
import { formatDate } from '../../src/utils/dateUtils';

jest.mock('../../src/utils/dateUtils', () => ({
  formatDate: jest.fn(() => 'June 19, 2024'),
}));

describe('ArchiveEntry', () => {
  let mockEntry;
  let mockOnToggle;

  beforeEach(() => {
    mockEntry = {
      id: 1,
      createdAt: '2024-06-19',
      Quote: {
        quote_text: 'This is a test quote.',
        author: 'Marcus Aurelius',
      },
      journal_text: 'This is my journal entry.',
    };

    mockOnToggle = jest.fn();

    jest.clearAllMocks();
  });

  it('renders the date using formatDate()', () => {
    render(<ArchiveEntry entry={mockEntry} isExpanded={false} onToggle={mockOnToggle} />);
    expect(formatDate).toHaveBeenCalledWith('2024-06-19');
    expect(screen.getByText('June 19, 2024')).toBeInTheDocument();
  });

  it('calls onToggle when date button is clicked', () => {
    render(<ArchiveEntry entry={mockEntry} isExpanded={false} onToggle={mockOnToggle} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(mockOnToggle).toHaveBeenCalledWith(1);
  });

  it('displays quote and journal text when expanded', () => {
    render(<ArchiveEntry entry={mockEntry} isExpanded={true} onToggle={mockOnToggle} />);
    expect(screen.getByText(/This is a test quote/i)).toBeInTheDocument();
    expect(screen.getByText(/— Marcus Aurelius/i)).toBeInTheDocument();
    expect(screen.getByText(/This is my journal entry/i)).toBeInTheDocument();
  });

  it('does not show quote or journal when not expanded', () => {
    render(<ArchiveEntry entry={mockEntry} isExpanded={false} onToggle={mockOnToggle} />);
    expect(screen.queryByText(/This is a test quote/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/This is my journal entry/i)).not.toBeInTheDocument();
  });
});
