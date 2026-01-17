export function setSessionToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem("sessionToken", token);
}

export function getSessionToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("sessionToken");
}

export function removeSessionToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("sessionToken");
}

export function clearSessionToken() {
  removeSessionToken();
}

export function hasSession() {
  return !!getSessionToken();
}