const API_BASE = API; // from config.js

async function apiRequest(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        ...(adminUser ? { "admin": adminUser } : {})
      }
    });

    // 🔥 Handle HTTP errors
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HTTP ${res.status}: ${text}`);
    }

    const data = await res.json();

    // 🔥 Handle backend errors
    if (data?.error) {
      throw new Error(data.error);
    }

    return data;

  } catch (err) {
    handleError(err);
    return null;
  }
}
f
