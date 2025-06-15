import ArchiveEntry from './ArchiveEntry';

function RecentArchiveGroup({ entries, expandedEntryId, onEntryToggle }) {
  return (
    <>
      <h3>Recent Entries</h3>
      {entries.map((entry) => (
        <ArchiveEntry
          key={entry.id}
          entry={entry}
          isExpanded={expandedEntryId === entry.id}
          onToggle={onEntryToggle}
        />
      ))}
    </>
  );
}

export default RecentArchiveGroup;