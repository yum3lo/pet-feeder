import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../style/theme';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Login pressed');
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={[typography.h2, { color: colors.text, marginBottom: spacing.md }]}>
          Sign In
        </Text>
        <Text style={[typography.bodySmall, { color: colors.stroke, marginBottom: spacing.lg }]}>
          Enter your credentials to access your account
        </Text>
        <TextInput
          style={styles.input}
          placeholder="name@example.com"
          placeholderTextColor={colors.stroke}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={colors.stroke}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.accent }]}
          onPress={handleLogin}
        >
          <Text style={[typography.body, { color: colors.background }]}>Sign In</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.backContainer]}>
        <TouchableOpacity
          style={[styles.backButton]}
          onPress={() => navigation.navigate('Register')}
        >
            <MaterialIcons name="keyboard-backspace" size={24} color={colors.accent} />
          <Text style={[typography.bodySmall, { color: colors.accent }]}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  input: {
    width: '90%',
    height: 48,
    borderColor: colors.stroke,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.lg,
    color: colors.text,
  },
  button: {
    width: '90%',
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
