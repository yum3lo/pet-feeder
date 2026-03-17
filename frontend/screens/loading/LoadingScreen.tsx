import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { Logo, GlowEffect } from '@/components';
import { useGlowAnimation } from '@/hooks';
import { restoreAuthToken } from '@/services';
import { colors, spacing } from '@/style';

import type { RootStackParamList } from '@/types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

const SPLASH_DURATION = 3000;

export default function LoadingScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { glowScale, glowOpacity } = useGlowAnimation();

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      const [token] = await Promise.all([
        restoreAuthToken(),
        new Promise((resolve) => setTimeout(resolve, SPLASH_DURATION)),
      ]);
      if (!cancelled) {
        navigation.replace(token ? 'Home' : 'Register');
      }
    };
    run();
    return () => { cancelled = true; };
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.logoWrapper}>
        <GlowEffect glowScale={glowScale} glowOpacity={glowOpacity} />
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
});
