import { StyleSheet } from 'react-native';

import { colors, spacing } from '@/style';

export const styles = StyleSheet.create({
  petDropdown: {
    width: '90%',
    alignSelf: 'center',
    marginBottom: spacing.sm,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  title: {
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  loadingState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
});