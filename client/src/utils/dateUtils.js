export function getTodayDateString() {
  return new Date().toISOString().split('T')[0];
}

export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString();
}