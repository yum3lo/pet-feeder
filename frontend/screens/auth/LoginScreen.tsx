import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { colors, typography, spacing, common } from '@/style';
import { useLogin } from '@/services/auth';
import { useToast } from '@/contexts/ToastContext';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { mutate: login, isPending } = useLogin();
  const { showToast } = useToast();

  const handleLogin = () => {
    login(
      { email, password },
      {
        onSuccess: (data) => navigation.navigate((data.user.cats?.length ?? 0) === 0 ? 'AddPet' : 'Home'),
        onError: (err: any) =>
          showToast(err?.response?.data?.message ?? 'Login failed', 'error'),
      },
    );
  };

  return (
    <>
      <View style={common.screenContainer}>
        <Text style={[typography.h2, common.title]}>
          Sign In
        </Text>
        <Text style={[typography.bodySmall, common.subtitle]}>
          Enter your credentials to access your account
        </Text>
        <TextInput
          style={common.input}
          placeholder="name@example.com"
          placeholderTextColor={colors.stroke}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={common.input}
          placeholder="Password"
          placeholderTextColor={colors.stroke}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={[common.button, { backgroundColor: colors.accent }]}
          onPress={handleLogin}
          disabled={isPending}
        >
          <Text style={[typography.bodyBold, { color: colors.background }]}>
            {isPending ? 'Signing in…' : 'Sign In'}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.backContainer]}>
        <TouchableOpacity
          style={[styles.backButton]}
          onPress={() => navigation.navigate('Register')}
        >
            <MaterialIcons name="keyboard-backspace" size={24} color={colors.accent} />
          <Text style={[typography.bodySmall, { color: colors.accent, fontWeight: "500" }]}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  backContainer: {
    backgroundColor: colors.background,
    paddingBottom: spacing.md,
    paddingLeft: spacing.xxl,
  },
  backButton: {
    display: 'flex',
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
});
