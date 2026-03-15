import { StyleSheet, Text, View, TouchableOpacity, type ViewStyle } from 'react-native';
import { colors, typography, spacing, radius } from '@/style';

type Variant = 'modal' | 'compact' | 'row';

type Props = {
  leftLabel: string;
  rightLabel: string;
  onLeft: () => void;
  onRight: () => void;
  variant?: Variant;
  style?: ViewStyle;
};

export default function ActionButtons({
  leftLabel,
  rightLabel,
  onLeft,
  onRight,
  variant = 'modal',
  style,
}: Props) {
  if (variant === 'compact') {
    return (
      <View style={[styles.compactRow, style]}>
        <TouchableOpacity style={styles.ghostPad} onPress={onLeft}>
          <Text style={[typography.body, { color: colors.text }]}>{leftLabel}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filledCompact} onPress={onRight}>
          <Text style={[typography.bodyBold, { color: '#fff' }]}>{rightLabel}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (variant === 'row') {
    return (
      <View style={[styles.rowContainer, style]}>
        <TouchableOpacity style={styles.outlinedHalf} onPress={onLeft}>
          <Text style={[typography.bodyBold, { color: colors.accent }]}>{leftLabel}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filledHalf} onPress={onRight}>
          <Text style={[typography.bodyBold, { color: '#fff' }]}>{rightLabel}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.modalRow, style]}>
      <TouchableOpacity style={styles.ghostPad} onPress={onLeft}>
        <Text style={[typography.bodyBold, { color: colors.accent }]}>{leftLabel}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.filledFlex} onPress={onRight}>
        <Text style={[typography.bodyBold, { color: '#fff' }]}>{rightLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  modalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  ghostPad: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  filledFlex: {
    flex: 1,
    marginLeft: spacing.xl,
    height: 48,
    backgroundColor: colors.accent,
    borderRadius: radius.input,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing.md,
  },
  filledCompact: {
    backgroundColor: colors.accent,
    borderRadius: radius.input,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
  },
  rowContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    width: '90%',
  },
  outlinedHalf: {
    flex: 1,
    height: 48,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filledHalf: {
    flex: 1,
    height: 48,
    borderRadius: radius.input,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
