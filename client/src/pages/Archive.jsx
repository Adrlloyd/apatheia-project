import { useEffect, useState } from 'react';
import '../styles/Archive.css';
import Navbar from '../components/Navbar';
import { fetchJournalHistory } from '../services/journalService';
import RecentArchiveGroup from '../components/RecentArchiveGroup';
import MonthlyArchiveGroup from '../components/MonthlyArchiveGroup';

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
          <RecentArchiveGroup
            entries={recentEntries}
            expandedEntryId={expandedRecentId}
            onEntryToggle={toggleRecentExpand}
          />
        )}

        {Object.keys(monthlyEntries).length > 0 && (
          <>
            <h3>Past Entries by Month</h3>
            {Object.entries(monthlyEntries).map(([month, entries]) => (
              <MonthlyArchiveGroup
                key={month}
                month={month}
                entries={entries}
                isExpanded={expandedMonth === month}
                onMonthToggle={(m) =>
                  setExpandedMonth(expandedMonth === m ? null : m)
                }
                expandedEntryId={expandedMonthEntryId}
                onEntryToggle={toggleMonthExpand}
              />
            ))}
          </>
        )}
      </div>
    </>
  );
}

export default Archive;