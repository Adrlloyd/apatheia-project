import { useEffect, useState } from 'react';
import { fetchTodayJournal, saveOrUpdateJournal } from '../services/journalService';
import '../styles/JournalInput.css';
import { fetchDeepQuestion } from '../services/openaiService';



function JournalInput({ quoteId }) {
  const [input, setInput] = useState('');
  const [existingEntry, setExistingEntry] = useState(false);
  const [status, setStatus] = useState('');
  const token = localStorage.getItem('token');
  const [question, setQuestion] = useState('');
  const [showPrompt, setShowPrompt] = useState(false);
  const [loading, setLoading] = useState(false);

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

    try {
      const result = await saveOrUpdateJournal({ input, existingEntry, quoteId, token });
      setStatus(result.message || 'Entry saved.');
      setShowPrompt(true);
      setExistingEntry(true);
    } catch (error) {
      console.error('Failed to save journal:', error);
      setStatus('Failed to save entry.');
    }
  };

  const handleGetQuestion = async () => {
    setLoading(true);
    setQuestion('');
    const result = await fetchDeepQuestion(input);
    if (result) setQuestion(result);
    setLoading(false);
  };

  return (
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

      {status && <p className="status-message">{status}</p>}

      {showPrompt && !question && (
        <button
          type="button"
          onClick={handleGetQuestion}
          className="submit-button"
        >
          Explore this concept further...
        </button>
      )}

      {loading && <p className="status-message">Generating Stoic question...</p>}

      {question && (
        <div className="reflection-question">
          <p>{question}</p>
        </div>
      )}
    </form>
  );
}

export default JournalInput;