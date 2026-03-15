import { useMutation } from '@tanstack/react-query';
import { api, setAuthToken } from './api';
import type { AuthResponse, AuthPayload } from '@/types';


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
