// Simple session management without auth
const SESSION_KEY = 'mound_session_token';

export function getSessionToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(SESSION_KEY);
}

export function setSessionToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SESSION_KEY, token);
}

export function clearSessionToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SESSION_KEY);
}

export function hasSession(): boolean {
  return !!getSessionToken();
}
