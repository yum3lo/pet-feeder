import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';

import { useRegisterForm } from '@/hooks';
import { colors, typography, spacing, common } from '@/style';

import type { RootStackParamList } from '@/types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export default function RegisterScreen({ navigation }: Props) {
  const { email, setEmail, password, setPassword, confirmPassword, setConfirmPassword, isPending, handleRegister } = useRegisterForm(navigation);

  const fields = [
    { placeholder: 'name@example.com', value: email, onChangeText: setEmail, keyboardType: 'email-address' as const, autoCapitalize: 'none' as const, secureTextEntry: false },
    { placeholder: 'Password', value: password, onChangeText: setPassword, secureTextEntry: true },
    { placeholder: 'Confirm Password', value: confirmPassword, onChangeText: setConfirmPassword, secureTextEntry: true },
  ];

  return (
    <View style={common.screenContainer}>
      <Text style={[typography.h2, common.title]}>
        Create an account
      </Text>
      <Text style={[typography.bodySmall, common.subtitle]}>
        Enter your email below to create an account
      </Text>

      {fields.map((field) => (
        <TextInput
          key={field.placeholder}
          style={common.input}
          placeholderTextColor={colors.stroke}
          {...field}
        />
      ))}

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
