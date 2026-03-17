import { useMutation } from '@tanstack/react-query';
import * as SecureStore from 'expo-secure-store';


import type { AuthResponse, AuthPayload } from '@/types';

import { api, setAuthToken } from './api';

const TOKEN_KEY = 'auth_token';

export const restoreAuthToken = async (): Promise<string | null> => {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  setAuthToken(token);
  return token;
};

export const logoutUser = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  setAuthToken(null);
};

const persistToken = async (token: string) => {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
  setAuthToken(token);
};

const register = async (payload: AuthPayload): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/auth/register', payload);
  await persistToken(data.access_token);
  return data;
};

const login = async (payload: AuthPayload): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/auth/login', payload);
  await persistToken(data.access_token);
  return data;
};

export const useRegister = () =>
  useMutation({ mutationFn: register });

export const useLogin = () =>
  useMutation({ mutationFn: login });
