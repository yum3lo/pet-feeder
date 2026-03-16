import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors, spacing, typography } from '@/style';

type Props = {
  label?: string;
  onPress: () => void;
};

export default function BackButton({ label = 'Go Back', onPress }: Props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <MaterialIcons name="keyboard-backspace" size={24} color={colors.accent} />
        <Text style={[typography.bodySmall, { color: colors.accent, fontWeight: '500' }]}>{label}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    paddingBottom: spacing.md,
    paddingLeft: spacing.xxl,
  },
  button: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
});
