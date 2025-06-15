import { formatDate } from '../utils/dateUtils';

function ArchiveEntry({ entry, isExpanded, onToggle }) {
  return (
    <div className="entry-preview">
      <button onClick={() => onToggle(entry.id)} className="entry-date">
        {formatDate(entry.createdAt)}
      </button>

      {isExpanded && (
        <div className="entry-details">
          <blockquote>"{entry.Quote.quote_text}"</blockquote>
          <p>— {entry.Quote.author}</p>
          <div className="journal-readonly">{entry.journal_text}</div>
        </div>
      )}
    </div>
  );
}

export default ArchiveEntry;