import { useEffect, useState } from 'react';
import { fetchDeepQuestion } from '../services/openaiService';
import '../styles/OpenAIInput.css';
import { getQuestionForToday, setQuestionForToday } from '../utils/storageUtils';

function OpenAIInput({ journalText }) {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const savedQuestion = getQuestionForToday();

    if (savedQuestion) {
      setQuestion(savedQuestion);
      setShowPrompt(false);
    } else {
      setShowPrompt(true);
    }
  }, []);

  const handleGetQuestion = async () => {
    setLoading(true);

    const result = await fetchDeepQuestion(journalText);
    if (result) {
      setQuestion(result);
      setQuestionForToday(result);
      setShowPrompt(false);
    }

    setLoading(false);
  };

  return (
    <div className="openai-container">
      {question && (
        <div className="reflection-question">
          <p>{question}</p>
        </div>
      )}

      {!question && showPrompt && (
        <button
          type="button"
          onClick={handleGetQuestion}
          className="explore-button"
        >
          Explore this concept further...
        </button>
      )}

      {loading && <p className="status-message">Generating Stoic question...</p>}
    </div>
  );
}

export default OpenAIInput;