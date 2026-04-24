import axios from 'axios';

import { navigationRef } from '@/navigation/navigationRef';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

// Automatically sign the user out when the server rejects the token
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url ?? '';
    if (error.response?.status === 401 && !url.startsWith('/auth/')) {
      authToken = null;
      if (navigationRef.isReady()) {
        navigationRef.reset({ index: 0, routes: [{ name: 'Register' }] });
      }
    }
    return Promise.reject(error);
  },
);
