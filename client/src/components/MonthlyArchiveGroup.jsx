import ArchiveEntry from './ArchiveEntry';

function MonthlyArchiveGroup({
  month,
  entries,
  isExpanded,
  onMonthToggle,
  expandedEntryId,
  onEntryToggle
}) {
  return (
    <div className="month-group">
      <button
        onClick={() => onMonthToggle(month)}
        className="month-toggle"
      >
        {month}
      </button>

      {isExpanded &&
        entries.map((entry) => (
          <ArchiveEntry
            key={entry.id}
            entry={entry}
            isExpanded={expandedEntryId === entry.id}
            onToggle={onEntryToggle}
          />
        ))}
    </div>
  );
}

export default MonthlyArchiveGroup;