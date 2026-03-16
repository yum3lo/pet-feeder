import { Text, View, TextInput, TouchableOpacity } from 'react-native';

import { BackButton } from '@/components';
import { useLoginForm } from '@/hooks';
import { colors, typography, common } from '@/style';

import type { RootStackParamList } from '@/types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const { email, setEmail, password, setPassword, isPending, handleLogin } = useLoginForm(navigation);

  const fields = [
    { placeholder: 'name@example.com', value: email, onChangeText: setEmail, keyboardType: 'email-address' as const, autoCapitalize: 'none' as const, secureTextEntry: false },
    { placeholder: 'Password', value: password, onChangeText: setPassword, secureTextEntry: true },
  ];

  return (
    <>
      <View style={common.screenContainer}>
        <Text style={[typography.h2, common.title]}>Sign In</Text>
        <Text style={[typography.bodySmall, common.subtitle]}>
          Enter your credentials to access your account
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
          onPress={handleLogin}
          disabled={isPending}
        >
          <Text style={[typography.bodyBold, { color: colors.background }]}>
            {isPending ? 'Signing in…' : 'Sign In'}
          </Text>
        </TouchableOpacity>
      </View>
      <BackButton onPress={() => navigation.navigate('Register')} />
    </>
  );
}

