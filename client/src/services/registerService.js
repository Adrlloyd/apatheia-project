const API_BASE = import.meta.env.VITE_API_BASE;

export async function registerUser(formData) {
  const response = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Registration failed.');
  }

  return result;
}