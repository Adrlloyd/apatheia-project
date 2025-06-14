const API_BASE = import.meta.env.VITE_API_BASE;

export async function loginUser(credentials) {
  const response = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Login failed.');
  }

  return result;
}