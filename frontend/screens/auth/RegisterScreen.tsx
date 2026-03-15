import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';

import { colors, typography, spacing, common } from '@/style';
import { useRegister } from '@/services/auth';
import { useToast } from '@/contexts/ToastContext';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export default function RegisterScreen({ navigation }: Props) {
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


  return (
    <View style={common.screenContainer}>
      <Text style={[typography.h2, common.title]}>
        Create an account
      </Text>
      <Text style={[typography.bodySmall, common.subtitle]}>
        Enter your email below to create an account
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
      <TextInput
        style={common.input}
        placeholder="Confirm Password"
        placeholderTextColor={colors.stroke}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={[common.button, { backgroundColor: colors.accent }]}
        onPress={handleRegister}
        disabled={isPending}
      >
        <Text style={[typography.bodyBold, { color: colors.background }]}>
          {isPending ? 'Signing up…' : 'Sign Up'}
        </Text>
      </TouchableOpacity>
      <View style={styles.separator}>
        <View style={styles.line} />
        <Text
          style={[typography.bodySmall, styles.separatorText]}
        >
          Already have an account?
        </Text>
        <View style={styles.line} />
      </View>
      <TouchableOpacity
        style={[common.buttonSecondary]}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={[typography.bodyBold, { color: colors.accent }]}>Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.md,
    width: '90%',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.stroke,
  },
  separatorText: {
    color: colors.stroke,
    marginHorizontal: spacing.sm,
  },
});
