const API_BASE = import.meta.env.VITE_API_BASE

export const updateName = async (name, token) => {
  return fetch(`${API_BASE}/users/update-name`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  });
};

export const updateUsername = async (username, token) => {
  return fetch(`${API_BASE}/users/update-username`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ username }),
  });
};

export const updatePassword = async (currentPassword, newPassword, token) => {
  return fetch(`${API_BASE}/users/update-password`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
};

export const deleteUser = async (token) => {
  return fetch(`${API_BASE}/users`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};