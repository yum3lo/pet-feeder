import { Dimensions, StyleSheet } from 'react-native';

import { colors, spacing } from '@/style';

const SCREEN_WIDTH = Dimensions.get('window').width;
export const PEEK = 28;
export const CARD_WIDTH = SCREEN_WIDTH - 48;
export const CAROUSEL_SLOT_WIDTH = SCREEN_WIDTH - PEEK;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  title: {
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xxl,
  },
  scrollArea: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
  },
  cardWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  addPetButton: {
    marginTop: spacing.md,
  },
  logoutButton: {
    marginTop: spacing.lg,
    width: CARD_WIDTH,
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.outline,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
