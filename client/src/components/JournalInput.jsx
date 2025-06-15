import { useEffect, useState } from 'react';
import { fetchTodayJournal, saveOrUpdateJournal } from '../services/journalService';
import '../styles/JournalInput.css';
import OpenAIInput from './OpenAIInput';

function JournalInput({ quoteId }) {
  const [input, setInput] = useState('');
  const [existingEntry, setExistingEntry] = useState(false);
  const [status, setStatus] = useState('');
  const [fadeStatus, setFadeStatus] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const getTodayEntry = async () => {
      try {
        const data = await fetchTodayJournal(token);
        setInput(data.journal_text);
        setExistingEntry(true);
      } catch {
        console.log('No journal found for today (yet).');
      }
    };

    getTodayEntry();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    setFadeStatus(false);

    try {
      const result = await saveOrUpdateJournal({ input, existingEntry, quoteId, token });
      setStatus(result.message || 'Entry saved.');
      setExistingEntry(true);
    } catch (error) {
      console.error('Failed to save journal:', error);
      setStatus('Failed to save entry.');
    }
  };

  useEffect(() => {
    if (status) {
      setFadeStatus(false);
      const fadeTimer = setTimeout(() => setFadeStatus(true), 3000);
      const clearTimer = setTimeout(() => setStatus(''), 30000);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(clearTimer);
      };
    }
  }, [status]);

  return (
    <>
      <form onSubmit={handleSubmit} className="journal-form">
        <textarea
          className="journal-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Write your thoughts here..."
          rows={13}
        />

        <button type="submit" className="submit-button">
          {existingEntry ? 'Update Entry' : 'Save Entry'}
        </button>

        <p
          className={`status-message ${!status ? 'invisible' : ''} ${fadeStatus ? 'fade-out' : ''}`}
        >
          {status || ' '}
        </p>
      </form>

      <OpenAIInput journalText={input} />
    </>
  );
}

export default JournalInput;