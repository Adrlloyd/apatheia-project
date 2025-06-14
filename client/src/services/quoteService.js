const API_BASE = import.meta.env.VITE_API_BASE;

export async function fetchDailyQuote() {
  try {
    const response = await fetch(`${API_BASE}/quote`);
    if (!response.ok) {
      throw new Error(`Failed to fetch quote: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in fetchDailyQuote:', error);
    throw error;
  }
};