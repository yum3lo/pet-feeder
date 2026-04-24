import { StyleSheet } from 'react-native';

import { colors, spacing } from '@/style';

export const styles = StyleSheet.create({
  inputWithSuffix: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: spacing.md,
  },
  innerInput: {
    flex: 1,
    height: '100%',
    color: colors.text,
    fontSize: 14,
  },
  suffix: {
    fontSize: 14,
    color: colors.stroke,
    fontWeight: '500',
    paddingRight: spacing.lg,
  },
  speciesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  speciesLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  speciesButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  speciesButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  speciesButtonActive: {
    borderBottomColor: colors.accent,
  },
  speciesButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.stroke,
  },
  speciesButtonTextActive: {
    color: colors.accent,
    fontWeight: '600',
  },
});
