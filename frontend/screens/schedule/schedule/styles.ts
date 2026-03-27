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
  petName: {
    color: colors.accent,
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: spacing.xl,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  toggleLabel: {
    flex: 1,
    color: colors.stroke,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.outline,
    marginHorizontal: spacing.xl,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.lg,
  },
  mealsSection: {
    marginTop: spacing.xl,
  },
  sectionLabel: {
    color: colors.stroke,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.sm,
  },
  mealRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  addMealButton: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  fab: {
    position: 'absolute',
    bottom: 130,
    right: spacing.xl,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  emptyState: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
    justifyContent: 'center',
  },
  emptyImage: {
    width: 76,
    height: 76,
  },
  emptyText: {
    color: colors.stroke,
    textAlign: 'center',
  },
});
