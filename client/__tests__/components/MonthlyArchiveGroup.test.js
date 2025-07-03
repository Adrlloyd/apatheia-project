import { render, screen, fireEvent } from '@testing-library/react';
import MonthlyArchiveGroup from 'src/components/MonthlyArchiveGroup';

jest.mock('src/components/ArchiveEntry', () => ({ entry, isExpanded }) => (
  <div data-testid="archive-entry">
    MockEntry-{entry.id} {isExpanded ? '(open)' : '(closed)'}
  </div>
));

describe('MonthlyArchiveGroup', () => {
  const mockMonth = 'June 2025';
  const mockEntries = [
    { id: 1, Quote: { quote_text: 'Q1' }, journal_text: 'J1', createdAt: '2025-06-01' },
    { id: 2, Quote: { quote_text: 'Q2' }, journal_text: 'J2', createdAt: '2025-06-02' },
  ];

  let toggleMonthMock, toggleEntryMock;

  beforeEach(() => {
    toggleMonthMock = jest.fn();
    toggleEntryMock = jest.fn();
  });

  it('renders the month button with the correct label', () => {
    render(
      <MonthlyArchiveGroup
        month={mockMonth}
        entries={mockEntries}
        isExpanded={false}
        onMonthToggle={toggleMonthMock}
        expandedEntryId={null}
        onEntryToggle={toggleEntryMock}
      />
    );

    expect(screen.getByRole('button', { name: mockMonth })).toBeInTheDocument();
  });

  it('calls onMonthToggle with month when clicked', () => {
    render(
      <MonthlyArchiveGroup
        month={mockMonth}
        entries={mockEntries}
        isExpanded={false}
        onMonthToggle={toggleMonthMock}
        expandedEntryId={null}
        onEntryToggle={toggleEntryMock}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: mockMonth }));
    expect(toggleMonthMock).toHaveBeenCalledWith(mockMonth);
  });

  it('does not render entries if isExpanded is false', () => {
    render(
      <MonthlyArchiveGroup
        month={mockMonth}
        entries={mockEntries}
        isExpanded={false}
        onMonthToggle={toggleMonthMock}
        expandedEntryId={null}
        onEntryToggle={toggleEntryMock}
      />
    );

    expect(screen.queryByTestId('archive-entry')).not.toBeInTheDocument();
  });

  it('renders entries if isExpanded is true', () => {
    render(
      <MonthlyArchiveGroup
        month={mockMonth}
        entries={mockEntries}
        isExpanded={true}
        onMonthToggle={toggleMonthMock}
        expandedEntryId={2}
        onEntryToggle={toggleEntryMock}
      />
    );

    const entries = screen.getAllByTestId('archive-entry');
    expect(entries).toHaveLength(2);
    expect(entries[0]).toHaveTextContent('MockEntry-1 (closed)');
    expect(entries[1]).toHaveTextContent('MockEntry-2 (open)');
  });
});