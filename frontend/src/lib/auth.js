function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function setAccessToken(token) {
  localStorage.setItem('access_token', token);
  const payload = parseJwt(token);
  if (payload) localStorage.setItem('auth_payload', JSON.stringify(payload));
}

export function getAccessToken() {
  return localStorage.getItem('access_token');
}

export function getAuthPayload() {
  const raw = localStorage.getItem('auth_payload');
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function isLoggedIn() {
  return !!getAccessToken();
}

export function getRole() {
  const payload = getAuthPayload();
  return payload?.role || null;
}

export function logout() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('auth_payload');
}
