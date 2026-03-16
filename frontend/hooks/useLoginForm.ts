import { useState } from 'react';

import { useToast } from '@/contexts';
import { useLogin, api } from '@/services';

import type { RootStackParamList } from '@/types';
import type { NavigationProp } from '@react-navigation/native';

export function useLoginForm(navigation: NavigationProp<RootStackParamList>) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { mutate: login, isPending } = useLogin();
  const { showToast } = useToast();

  const handleLogin = () => {
    login(
      { email, password },
      {
        onSuccess: async () => {
          try {
            const { data: cats } = await api.get('/cats');
            navigation.navigate(cats.length === 0 ? 'AddPet' : 'Home');
          } catch {
            navigation.navigate('AddPet');
          }
        },
        onError: (err: any) =>
          showToast(err?.response?.data?.message ?? 'Login failed', 'error'),
      },
    );
  };

  return { email, setEmail, password, setPassword, isPending, handleLogin };
}
