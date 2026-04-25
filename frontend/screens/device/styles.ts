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
    width: '90%',
  },
  inputRow: {
    width: '100%',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  inputInner: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputText: {
    flex: 1,
    marginBottom: 0,
    width: '100%',
  },
  removeBtn: {
    position: 'absolute',
    right: spacing.xl,
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
