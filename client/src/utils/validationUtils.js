export function validateNewPassword(newPassword, currentPassword = null) {
  if (newPassword.length < 6) {
    return 'Password must be at least 6 characters long.';
  }

  if (currentPassword === null) {
    return null; // for registration
  }

  if (!currentPassword) {
    return 'Please enter your current password to change it.';
  }

  return null;
}
