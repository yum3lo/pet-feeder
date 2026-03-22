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
});
