import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // sends the httpOnly cookies from Phase 2
});

let refreshing = null;

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { config, response } = error;
    const isAuthRoute = config?.url?.includes('/auth/');
    if (response?.status === 401 && !config._retry && !isAuthRoute) {
      config._retry = true;
      try {
        refreshing ??= api.post('/auth/refresh').finally(() => (refreshing = null));
        await refreshing;
        return api(config);
      } catch {
        // fall through, caller handles the rejected promise (e.g. redirect to /login)
      }
    }
    return Promise.reject(error);
  }
);

export default api;