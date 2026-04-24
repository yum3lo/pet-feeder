import { useState, useRef } from 'react';

import { useToast } from '@/contexts';
import { useLogin, api } from '@/services';

import type { RootStackParamList } from '@/types';
import type { NavigationProp } from '@react-navigation/native';

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 30_000;

export function useLoginForm(navigation: NavigationProp<RootStackParamList>) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { mutate: login, isPending } = useLogin();
  const { showToast } = useToast();

  const attemptCount = useRef(0);
  const lockedUntil = useRef<number>(0);
  const [isLocked, setIsLocked] = useState(false);

  const handleLogin = () => {

    if (Date.now() < lockedUntil.current) {
      const remaining = Math.ceil((lockedUntil.current - Date.now()) / 1000);
      showToast(`Too many attempts. Try again in ${remaining}s.`, 'error');
      return;
    }

    login(
      { email: email.trim(), password },
      {
        onSuccess: async () => {
          attemptCount.current = 0;
          try {
            const { data: pets } = await api.get('/pets');
            navigation.navigate(pets.length === 0 ? 'AddPet' : 'Home');
          } catch {
            navigation.navigate('AddPet');
          }
        },
        onError: (err: any) => {
          attemptCount.current += 1;
          if (attemptCount.current >= MAX_ATTEMPTS) {
            lockedUntil.current = Date.now() + LOCKOUT_MS;
            setIsLocked(true);
            setTimeout(() => {
              attemptCount.current = 0;
              setIsLocked(false);
            }, LOCKOUT_MS);
            showToast('Too many failed attempts. Please wait 30 seconds.', 'error');
          } else {
            showToast(err?.response?.data?.message ?? 'Login failed', 'error');
          }
        },
      },
    );
  };

  return { email, setEmail, password, setPassword, isPending: isPending || isLocked, handleLogin };
}
