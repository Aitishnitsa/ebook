import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

let isRefreshing = false;
let failedQueue = [];

const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
  window.dispatchEvent(new StorageEvent('storage', {
    key: 'user',
    newValue: null,
    oldValue: localStorage.getItem('user')
  }));
};

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    error ? prom.reject(error) : prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.request.use(config => {
  const access_token = localStorage.getItem('access_token');
  if (access_token) {
    config.headers.Authorization = `Bearer ${access_token}`;
  }
  return config;
});

api.interceptors.response.use(
  res => res,
  async error => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      const refresh_token = localStorage.getItem('refresh_token');
      if (!refresh_token) {
        logout();
        return Promise.reject(error);
      }

      const decodedRefresh = jwtDecode(refresh_token);
      if (decodedRefresh.exp * 1000 < Date.now()) {
        logout();
        return Promise.reject(new Error('Refresh token expired'));
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = 'Bearer ' + token;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/refresh`,
          { refresh_token }
        );
        const { access_token } = response.data;
        localStorage.setItem('access_token', access_token);
        processQueue(null, access_token);
        originalRequest.headers.Authorization = 'Bearer ' + access_token;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        logout();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default api;