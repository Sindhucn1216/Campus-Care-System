const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const TOKEN_KEY = 'campuscare_auth_token';

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

async function request(endpoint, options = {}) {
  const token = getStoredToken();
  const headers = {
    ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (response.status === 401) {
    setStoredToken(null);
  }

  if (!response.ok) {
    const error = new Error(data?.message || `Request failed (${response.status})`);
    error.status = response.status;
    error.details = data?.errors;
    throw error;
  }

  return data;
}

export const api = {
  auth: {
    login: (email, password) =>
      request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
    register: (payload) =>
      request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
    logout: () => request('/auth/logout', { method: 'POST' }),
    me: () => request('/auth/me'),
    updateMe: (payload) =>
      request('/auth/me', { method: 'PATCH', body: JSON.stringify(payload) }),
  },

  complaints: {
    list: async (filters = {}) => {
      const query = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '' && value !== 'All') {
          query.set(key, value);
        }
      });
      const qs = query.toString();
      return request(`/complaints${qs ? `?${qs}` : ''}`);
    },
    getById: (id) => request(`/complaints/${encodeURIComponent(id)}`),
    track: (code) => request(`/complaints/track/${encodeURIComponent(code)}`),
    create: (data) =>
      request('/complaints', { method: 'POST', body: JSON.stringify(data) }),
    updateStatus: (id, status, note, _user, resolutionNotes) =>
      request(`/complaints/${encodeURIComponent(id)}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, note, resolutionNotes }),
      }),
    assign: (id, departmentId, staffId, note) =>
      request(`/complaints/${encodeURIComponent(id)}/assign`, {
        method: 'PATCH',
        body: JSON.stringify({ departmentId, staffId, note }),
      }),
    updatePriority: (id, priority) =>
      request(`/complaints/${encodeURIComponent(id)}/priority`, {
        method: 'PATCH',
        body: JSON.stringify({ priority }),
      }),
    submitFeedback: (id, feedback) =>
      request(`/complaints/${encodeURIComponent(id)}/feedback`, {
        method: 'POST',
        body: JSON.stringify({ rating: feedback.rating, comments: feedback.comments }),
      }),
  },

  departments: {
    list: () => request('/departments'),
    create: (data) => request('/departments', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, updates) =>
      request(`/departments/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      }),
  },

  analytics: {
    getDashboard: (departmentId) => {
      const query = departmentId ? `?departmentId=${encodeURIComponent(departmentId)}` : '';
      return request(`/admin/analytics${query}`);
    },
  },

  resetDemoData: () => request('/admin/demo/reset', { method: 'POST' }),
};
