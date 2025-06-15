const API_BASE = import.meta.env.VITE_API_BASE;

export const fetchDeepQuestion = async (journalText) => {
  try {
    const response = await fetch(`${API_BASE}/openai/question`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ journalText }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch deep question');
    }

    const data = await response.json();
    return data.question;
  } catch (error) {
    console.error('OpenAI fetch error:', error);
    return null;
  }
};
