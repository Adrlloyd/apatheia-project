import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RecentArchiveGroup from 'src/components/RecentArchiveGroup';

jest.mock('src/components/ArchiveEntry', () => ({ entry, isExpanded, onToggle }) => (
  <div data-testid="archive-entry" onClick={() => onToggle(entry.id)}>
    {entry.date} - {isExpanded ? 'Expanded' : 'Collapsed'}
  </div>
));

describe('RecentArchiveGroup', () => {
  const mockEntries = [
    { id: 1, date: '2025-07-01' },
    { id: 2, date: '2025-07-02' },
  ];

  it('renders recent entries heading and entries', () => {
    render(
      <RecentArchiveGroup
        entries={mockEntries}
        expandedEntryId={2}
        onEntryToggle={() => {}}
      />
    );

    expect(screen.getByText('Recent Entries')).toBeInTheDocument();
    expect(screen.getAllByTestId('archive-entry')).toHaveLength(2);
    expect(screen.getByText('2025-07-02 - Expanded')).toBeInTheDocument();
    expect(screen.getByText('2025-07-01 - Collapsed')).toBeInTheDocument();
  });

  it('calls onEntryToggle when an entry is clicked', () => {
    const handleToggle = jest.fn();

    render(
      <RecentArchiveGroup
        entries={mockEntries}
        expandedEntryId={null}
        onEntryToggle={handleToggle}
      />
    );

    fireEvent.click(screen.getByText('2025-07-01 - Collapsed'));

    expect(handleToggle).toHaveBeenCalledWith(1);
  });
});