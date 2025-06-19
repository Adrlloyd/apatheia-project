import { jwtDecode } from 'jwt-decode';
import { clearUserSession } from './storageUtils';

export function setupAutoLogout(token, onExpire) {
  try {
    const decoded = jwtDecode(token);
    const expirationTimeMs = decoded.exp * 1000;
    const now = Date.now();
    const delay = expirationTimeMs - now;

    if (delay <= 0) {
      clearUserSession();
      onExpire();
    } else {
      setTimeout(() => {
        clearUserSession();
        onExpire();
      }, delay);
    }
  } catch (error) {
    console.error('Failed to decode token for auto-logout:', error);
    clearUserSession();
    onExpire();
  }
}