import { StyleSheet } from 'react-native';

import { colors, spacing } from '@/style';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  title: {
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
});