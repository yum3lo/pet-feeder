import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { colors, typography, spacing } from '../style/theme';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export default function RegisterScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    console.log('Register', email, password);
  };

  const handleLogin = () => {
    console.log('Login pressed');
  };

  return (
    <View style={styles.container}>
      <Text style={[typography.h2, { color: colors.text, marginBottom: spacing.md }]}>
        Create an account
      </Text>
      <Text style={[typography.bodySmall, { color: colors.stroke, marginBottom: spacing.lg }]}>
        Enter your email below to create an account
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
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor={colors.stroke}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.accent }]}
        onPress={handleRegister}
      >
        <Text style={[typography.body, { color: colors.background }]}>Sign Up</Text>
      </TouchableOpacity>
      <View style={styles.separator}>
        <View style={styles.line} />
        <Text
          style={[typography.bodySmall, { color: colors.stroke, marginHorizontal: spacing.sm }]}
        >
          Already have an account?
        </Text>
        <View style={styles.line} />
      </View>
      <TouchableOpacity
        style={[styles.button, { borderColor: colors.accent, borderWidth: 1 }]}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={[typography.body, { color: colors.accent }]}>Sign In</Text>
      </TouchableOpacity>
    </View>
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
});
