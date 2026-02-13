const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://electro-store-backend-p7dc.onrender.com';

function getToken() {
  return localStorage.getItem('access_token');
}

async function request(path, options = {}) {
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');

  const token = getToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  // Try parse JSON safely
  let data = null;
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    data = await res.json().catch(() => null);
  } else {
    data = await res.text().catch(() => null);
  }

  if (!res.ok) {
    const message =
      (data && data.message && Array.isArray(data.message)
        ? data.message.join(', ')
        : data?.message) ||
      `Request failed (${res.status})`;

    throw new Error(message);
  }

  return data;
}

export const http = {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, body) =>
    request(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) =>
    request(path, { method: 'PUT', body: JSON.stringify(body) }),
  patch: (path, body) =>
    request(path, { method: 'PATCH', body: JSON.stringify(body)}),
  delete: (path) => request(path, { method: 'DELETE'}),
}
