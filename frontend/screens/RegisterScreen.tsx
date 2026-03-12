import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, common } from '../style';
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


  return (
    <View style={common.screenContainer}>
      <Text style={[typography.h2, { color: colors.text, marginBottom: spacing.md }]}>
        Create an account
      </Text>
      <Text style={[typography.bodySmall, { color: colors.stroke, marginBottom: spacing.lg }]}>
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
        style={[common.button, { borderColor: colors.accent, borderWidth: 1 }]}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={[typography.body, { color: colors.accent }]}>Sign In</Text>
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
});
