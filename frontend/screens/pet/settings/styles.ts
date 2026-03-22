import { Dimensions, StyleSheet } from 'react-native';

import { colors, spacing } from '@/style';

export const CARD_WIDTH = Dimensions.get('window').width - 48;

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
    paddingVertical: 14,
  },
  cardShadowLayer: {
    position: 'absolute',
    top: 60,
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 0,
  },
  avatarContainer: {
    zIndex: 1,
    marginBottom: -60,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: colors.background,
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
