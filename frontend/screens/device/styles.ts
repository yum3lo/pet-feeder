import { StyleSheet } from 'react-native';

import { colors, spacing, radius } from '@/style';

export const styles = StyleSheet.create({
  subtitle: {
    color: colors.stroke,
    width: '90%',
    textAlign: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  addMore: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  hint: {
    fontSize: 10,
    color: colors.stroke,
    paddingHorizontal: spacing.xs,
  },
  inputRow: {
    width: '90%',
    marginBottom: spacing.lg,
  },
  inputInner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
    width: '100%',
  },
  inputText: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
  },
  removeButton: {
    paddingLeft: spacing.md,
    paddingVertical: spacing.sm,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.xl,
    backgroundColor: colors.background,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  nextButton: {
    height: 44,
    paddingHorizontal: spacing.xxl,
    borderRadius: radius.input,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
