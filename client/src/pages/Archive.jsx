import { useEffect, useState } from 'react';
import '../styles/Archive.css';
import Navbar from '../components/Navbar';
import { fetchJournalHistory } from '../services/journalService';

function Archive() {
  const [recentEntries, setRecentEntries] = useState([]);
  const [monthlyEntries, setMonthlyEntries] = useState({});
  const [expandedRecentId, setExpandedRecentId] = useState(null);
  const [expandedMonthEntryId, setExpandedMonthEntryId] = useState(null);
  const [expandedMonth, setExpandedMonth] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [recentData, monthlyData] = await Promise.all([
          fetchJournalHistory(token, 'recent'),
          fetchJournalHistory(token, 'by-month'),
        ]);
        setRecentEntries(recentData);
        setMonthlyEntries(monthlyData);
      } catch (error) {
        console.error('Error fetching archive data:', error);
      }
    };

    fetchData();
  }, []);

  const toggleRecentExpand = (entryId) => {
    setExpandedRecentId(expandedRecentId === entryId ? null : entryId);
  };

  const toggleMonthExpand = (entryId) => {
    setExpandedMonthEntryId(expandedMonthEntryId === entryId ? null : entryId);
  };

  return (
    <>
      <Navbar />
      <div className="archive-container">
        <h2>Your Past Entries</h2>

        {recentEntries.length === 0 ? (
          <p className="no-entries-message">
            "The unexamined past is silent — begin the record today."
          </p>
        ) : (
          <>
            <h3>Recent Entries</h3>
            {recentEntries.map((entry) => (
              <div key={entry.id} className="entry-preview">
                <button
                  onClick={() => toggleRecentExpand(entry.id)}
                  className="entry-date"
                >
                  {new Date(entry.createdAt).toLocaleDateString()}
                </button>
                {expandedRecentId === entry.id && (
                  <div className="entry-details">
                    <blockquote>"{entry.Quote.quote_text}"</blockquote>
                    <p>— {entry.Quote.author}</p>
                    <div className="journal-readonly">{entry.journal_text}</div>
                  </div>
                )}
              </div>
            ))}
          </>
        )}

        {Object.keys(monthlyEntries).length > 0 && (
          <>
            <h3>Past Entries by Month</h3>
            {Object.entries(monthlyEntries).map(([month, entries]) => (
              <div key={month} className="month-group">
                <button
                  onClick={() =>
                    setExpandedMonth(expandedMonth === month ? null : month)
                  }
                  className="month-toggle"
                >
                  {month}
                </button>

                {expandedMonth === month &&
                  entries.map((entry) => (
                    <div key={entry.id} className="entry-preview">
                      <button
                        onClick={() => toggleMonthExpand(entry.id)}
                        className="entry-date"
                      >
                        {new Date(entry.createdAt).toLocaleDateString()}
                      </button>
                      {expandedMonthEntryId === entry.id && (
                        <div className="entry-details">
                          <blockquote>"{entry.Quote.quote_text}"</blockquote>
                          <p>— {entry.Quote.author}</p>
                          <div className="journal-readonly">{entry.journal_text}</div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
}

export default Archive;