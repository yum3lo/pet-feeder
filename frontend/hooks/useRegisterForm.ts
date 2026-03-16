import { useState } from 'react';

import { useToast } from '@/contexts';
import { useRegister } from '@/services';

import type { RootStackParamList } from '@/types';
import type { NavigationProp } from '@react-navigation/native';

export function useRegisterForm(navigation: NavigationProp<RootStackParamList>) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { mutate: register, isPending } = useRegister();
  const { showToast } = useToast();

  const handleRegister = () => {
    if (password !== confirmPassword) {
      showToast('Passwords do not match!', 'error');
      return;
    }
    register(
      { email, password },
      {
        onSuccess: () => navigation.navigate('AddPet'),
        onError: (err: any) =>
          showToast(err?.response?.data?.message ?? 'Registration failed', 'error'),
      },
    );
  };

  return { email, setEmail, password, setPassword, confirmPassword, setConfirmPassword, isPending, handleRegister };
}
