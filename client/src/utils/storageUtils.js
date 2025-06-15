import { getTodayDateString } from './dateUtils';
import { STORAGE_KEYS } from './constants';

export function setQuestionForToday(question) {
  const date = getTodayDateString();
  localStorage.setItem(STORAGE_KEYS.questionText(date), question);
  localStorage.setItem(STORAGE_KEYS.questionShown(date), 'true');
}

export function getQuestionForToday() {
  const date = getTodayDateString();
  const shown = localStorage.getItem(STORAGE_KEYS.questionShown(date));
  const text = localStorage.getItem(STORAGE_KEYS.questionText(date));
  return shown && text ? text : null;
}

export function storeUserSession({ token, name, id, firstVisit = false }) {
  localStorage.setItem('token', token);
  localStorage.setItem('name', name);
  localStorage.setItem('id', id);
  localStorage.setItem('firstVisit', firstVisit ? 'true' : 'false');
}

export function clearUserSession() {
  localStorage.removeItem('token');
  localStorage.removeItem('name');
  localStorage.removeItem('firstVisit');
  localStorage.removeItem('id');
}

export function isUserAuthenticated() {
  return Boolean(localStorage.getItem('token'));
}

export function getToken() {
  return localStorage.getItem('token');
}

export function getUserInfo() {
  return {
    name: localStorage.getItem('name') || '',
    firstVisit: localStorage.getItem('firstVisit') === 'true',
    id: localStorage.getItem('id') || null,
    token: localStorage.getItem('token') || null
  };
}

export function updateStoredName(newName) {
  localStorage.setItem('name', newName);
}