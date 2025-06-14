const API_BASE = import.meta.env.VITE_API_BASE;

export async function fetchTodayJournal(token) {
  const response = await fetch(`${API_BASE}/journal/today`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error('No journal found for today.');
  return await response.json();
}

export async function saveOrUpdateJournal({ input, existingEntry, quoteId, token }) {
  const endpoint = existingEntry
    ? `${API_BASE}/journal/update`
    : `${API_BASE}/journal`;
  const method = existingEntry ? 'PUT' : 'POST';

  const body = JSON.stringify({
    journal_text: input,
    ...(existingEntry
      ? { date: new Date().toISOString().split('T')[0] }
      : { quote_id: quoteId }),
  });

  const response = await fetch(endpoint, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body,
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Save failed');
  return result;
};

export async function fetchJournalHistory(token, mode = 'recent') {
  const endpoint =
    mode === 'recent' ? `${API_BASE}/journal/recent` : `${API_BASE}/journal/by-month`;

  try {
    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to fetch journal history');
    }

    return await response.json();
  } catch (error) {
    console.error(`Error in fetchJournalHistory [${mode}]:`, error);
    throw error;
  }
};