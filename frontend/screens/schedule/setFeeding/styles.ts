import { StyleSheet } from 'react-native';

import { colors, spacing, radius } from '@/style';

export const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.xxl,
  },
  buttonHalf: {
    width: 110,
  },
  grid: {
    width: '90%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  timeButton: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.outline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeButtonActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  timeText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
  },
  timeTextActive: {
    color: colors.background,
  },
  customRow: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  customInput: {
    flex: 1,
    marginBottom: 0,
  },
  confirmButton: {
    paddingHorizontal: spacing.lg,
    width: undefined,
    marginBottom: 0,
  },
  addButton: {
    flexDirection: 'row',
    gap: spacing.xs,
    borderColor: colors.accent,
    borderStyle: 'dashed',
  },
  customChip: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  selectedContainer: {
    width: '80%',
    marginBottom: spacing.lg,
  },
  bottomContainer: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.xl,
    width: '90%',
    alignSelf: 'center',
  },
});
