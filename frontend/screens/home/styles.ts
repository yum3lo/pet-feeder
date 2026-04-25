import { StyleSheet } from 'react-native';

import { colors, spacing } from '@/style';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.accent,
  },
  title: {
    color: colors.background,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.xl,
    paddingBottom: 120,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 0,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  mealCardContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  portionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
  },
  portionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.background,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  stepBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepValue: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.background,
    minWidth: 60,
    textAlign: 'center',
  },
});
