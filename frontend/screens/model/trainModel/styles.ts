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
    gap: spacing.xl,
  },
  title: {
    color: colors.text,
    textAlign: 'center',
  },
  description: {
    color: colors.stroke,
    textAlign: 'center',
    lineHeight: 24,
  },
  trainingState: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  button: {
    width: '100%',
    height: 52,
    backgroundColor: colors.accent,
    borderRadius: radius.input,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
  },
});
