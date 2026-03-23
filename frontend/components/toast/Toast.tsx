import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useToast } from '@/contexts';
import { colors, typography, spacing, radius } from '@/style';

export default function Toast() {
  const { toast } = useToast();
  const insets = useSafeAreaInsets();
  const opacity = useRef(new Animated.Value(0)).current;
  const isBottom = toast.position === 'bottom';
  const translateY = useRef(new Animated.Value(isBottom ? 16 : -16)).current;

  useEffect(() => {
    const hiddenOffset = isBottom ? 16 : -16;
    if (toast.visible) {
      translateY.setValue(hiddenOffset);
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 220, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 180, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: hiddenOffset, duration: 180, useNativeDriver: true }),
      ]).start();
    }
  }, [toast.visible, isBottom]);

  const isSuccess = toast.type === 'success';
  const iconName = isSuccess ? 'check-circle' : 'error';
  const borderColor = isSuccess ? colors.success : colors.error;
  const iconColor = isSuccess ? colors.success : colors.error;

  if (!toast.message) return null;

  const positionStyle = isBottom
    ? { bottom: insets.bottom + spacing.xl }
    : { top: insets.top + spacing.md };

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.container,
        positionStyle,
        { opacity, transform: [{ translateY }] },
      ]}
    >
      <View style={[styles.toast, { borderLeftColor: borderColor }]}>
        <MaterialIcons name={iconName} size={20} color={iconColor} />
        <Text style={[typography.bodySmall, styles.message]} numberOfLines={2}>
          {toast.message}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: spacing.xl,
    right: spacing.xl,
    zIndex: 10001,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: '#fff',
    borderRadius: radius.input,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
  message: {
    flex: 1,
    color: colors.text,
    fontWeight: '500',
  },
});
