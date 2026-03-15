import { useMutation } from '@tanstack/react-query';

import type { AuthResponse, AuthPayload } from '@/types';

import { api, setAuthToken } from './api';


const register = async (payload: AuthPayload): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/auth/register', payload);
  setAuthToken(data.access_token);
  return data;
};

const login = async (payload: AuthPayload): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/auth/login', payload);
  setAuthToken(data.access_token);
  return data;
};

export const useRegister = () =>
  useMutation({ mutationFn: register });

export const useLogin = () =>
  useMutation({ mutationFn: login });
