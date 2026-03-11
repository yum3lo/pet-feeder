import { StyleSheet, Text, View } from 'react-native';
import { colors, typography, spacing } from '../style/theme';

export default function RegisterScreen() {
  return (
    <View style={styles.container}>
      <Text style={[typography.h1, { color: colors.text }]}>Create Account</Text>
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
});
