const isProd =
  typeof window !== "undefined" &&
  window.location.hostname.endsWith("codingwithtom.com");

export const API_BASE = isProd
  ? "/progress-tracker/api" // same-origin in prod
  : "https://codingwithtom.com/progress-tracker/api"; // absolute in dev

const TOKEN_KEY = "pt_token";
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

async function request(path, { method = "GET", body, headers = {} } = {}) {
  const auth = getToken();
  const h = { "Content-Type": "application/json", ...headers };
  if (auth) h.Authorization = `Bearer ${auth}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: h,
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.error || `Request failed (${res.status})`;
    const err = new Error(msg);
    err.status = res.status;
    err.payload = data;
    throw err;
  }
  return data;
}

export const api = {
  register: ({ username, email, password }) =>
    request("/register", {
      method: "POST",
      body: { username, email, password },
    }),
  login: ({ email, password }) =>
    request("/login", { method: "POST", body: { email, password } }),
  me: () => request("/me", { method: "GET" }),
};

export async function signInAndStore({ email, password }) {
  const { token, user } = await api.login({ email, password });
  setToken(token);
  return user;
}
export async function registerThenSignIn({ username, email, password }) {
  await api.register({ username, email, password });
  return signInAndStore({ email, password });
}
