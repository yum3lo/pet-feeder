import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { spacing, typography } from '@/style';

const BANNER_CONTENT_HEIGHT = 44;
const SAFE_AREA_FALLBACK = 50;
const ANIMATION_DURATION_MS = 280;
const HIDDEN_OFFSET = -200;

export default function OfflineBanner() {
  const { isOnline } = useNetworkStatus();
  const insets = useSafeAreaInsets();
  const bannerHeight = (insets.top || SAFE_AREA_FALLBACK) + BANNER_CONTENT_HEIGHT;
  const bannerHeightRef = useRef(bannerHeight);
  bannerHeightRef.current = bannerHeight;
  const translateY = useRef(new Animated.Value(HIDDEN_OFFSET)).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: isOnline ? -bannerHeightRef.current : 0,
      duration: ANIMATION_DURATION_MS,
      useNativeDriver: false,
    }).start();
  }, [isOnline]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.banner, { top: 0, height: bannerHeight, paddingTop: insets.top, transform: [{ translateY }] }]}
    >
      <MaterialIcons name="wifi-off" size={20} color="#7C4A00" />
      <Text style={styles.text}>
        You're offline — feeding commands may not reach the feeder
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 10000,
    backgroundColor: '#FFC107',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 6,
  },
  text: {
    ...(typography.caption as object),
    color: '#7C4A00',
    fontWeight: '700',
    flexShrink: 1,
  },
});
