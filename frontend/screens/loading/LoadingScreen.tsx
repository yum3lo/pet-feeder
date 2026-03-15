import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Circle } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing } from '@/style/theme';
import Logo from '@/components/Logo';
import type { RootStackParamList } from '@/navigation/AppNavigator';

const AnimatedSvg = Animated.createAnimatedComponent(Svg);
const GLOW_SIZE = 90;
const SPLASH_DURATION = 3000;

export default function LoadingScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ]),
    ).start();
  }, [pulse]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.replace('Register');
    }, SPLASH_DURATION);
    return () => clearTimeout(timeout);
  }, [navigation]);

  const glowScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.95],
  });

  const glowOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 0.8],
  });

  return (
    <View style={styles.container}>
      <View style={styles.logoWrapper}>
        <AnimatedSvg
          width={GLOW_SIZE}
          height={GLOW_SIZE}
          style={[styles.glow, { transform: [{ scale: glowScale }], opacity: glowOpacity }]}
        >
          <Defs>
            <RadialGradient id="glow" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor="#FFFFFF" stopOpacity={1} />
              <Stop offset="40%" stopColor="#FFFFFF" stopOpacity={0.7} />
              <Stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Circle cx={GLOW_SIZE / 2} cy={GLOW_SIZE / 2} r={GLOW_SIZE / 2} fill="url(#glow)" />
        </AnimatedSvg>
        <Logo size={120} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
  },
});
