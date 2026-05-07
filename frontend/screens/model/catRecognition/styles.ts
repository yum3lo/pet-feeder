import { StyleSheet } from 'react-native';

import { colors, spacing, radius } from '@/style';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
  },
  catName: {
    color: colors.text,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  instructions: {
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  note: {
    color: colors.stroke,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 20,
  },
  warning: {
    color: colors.accent,
    textAlign: 'center',
    marginBottom: spacing.xxl,
  },
  capturingContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
    gap: spacing.md,
  },
  countdown: {
    color: colors.accent,
    fontWeight: '700',
  },
  button: {
    width: '100%',
    height: 52,
    backgroundColor: colors.accent,
    borderRadius: radius.input,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxl,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
  },
  progress: {
    color: colors.stroke,
    textAlign: 'center',
  },
});
