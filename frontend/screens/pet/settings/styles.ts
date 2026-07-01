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
  recognitionButton: {
    marginTop: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButton: {
    position: 'absolute',
    bottom: 110,
    right: spacing.xl,
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
