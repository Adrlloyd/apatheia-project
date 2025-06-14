import { useEffect, useState } from 'react';
import '../styles/Archive.css';
import Navbar from '../components/Navbar';
import { fetchJournalHistory } from '../services/journalService';

function Archive() {
  const [entries, setEntries] = useState([]);
  const [expandedEntryId, setExpandedEntryId] = useState(null);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const token = localStorage.getItem('token');
        const data = await fetchJournalHistory(token);
        setEntries(data);
      } catch (error) {
        console.error('Error fetching archive:', error);
      }
    };

    fetchEntries();
  }, []);

  const toggleExpand = (entryId) => {
    setExpandedEntryId(expandedEntryId === entryId ? null : entryId);
  };

  return (
    <>
      <Navbar />
      <div className="archive-container">
        <h2>Your Past Entries</h2>

        {entries.length === 0 ? (
          <p className="no-entries-message">
            "The unexamined past is silent — begin the record today."
          </p>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} className="entry-preview">
              <button
                onClick={() => toggleExpand(entry.id)}
                className="entry-date"
              >
                {new Date(entry.createdAt).toLocaleDateString()}
              </button>

              {expandedEntryId === entry.id && (
                <div className="entry-details">
                  <blockquote>"{entry.Quote.quote_text}"</blockquote>
                  <p>— {entry.Quote.author}</p>
                  <div className="journal-readonly">{entry.journal_text}</div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default Archive;
