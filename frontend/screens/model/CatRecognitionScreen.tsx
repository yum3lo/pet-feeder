import { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing, radius } from '@/style';

import type { RootStackParamList } from "@/types";
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<RootStackParamList, 'CatRecognition'>;

export default function CatRecognitionScreen({ navigation, route }: Props) {
  const { petNames, currentIndex } = route.params;
  const insets = useSafeAreaInsets();
  const [capturing, setCapturing] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const catName = petNames[currentIndex];
  const total = petNames.length;

  const DURATION_INTERVAL_MS = 1000;
  const COUNT_DOWN_S = 5;

  const startCapture = () => {
    setCapturing(true);
    setCountdown(COUNT_DOWN_S);
    let count = COUNT_DOWN_S;
    intervalRef.current = setInterval(() => {
      count -= 1;
      setCountdown(count);
      if (count <= 0) {
        clearInterval(intervalRef.current!);
        setCapturing(false);
        if (currentIndex + 1 < total) {
          navigation.replace('CatRecognition', {
            petNames,
            currentIndex: currentIndex + 1,
          });
        } else {
          navigation.replace('TrainModel');
        }
      }
    }, DURATION_INTERVAL_MS);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.xxl }]}>
      <View style={styles.content}>
        <Text style={[typography.h2, styles.catName]}>{catName}</Text>

        <Text style={[typography.body, styles.instructions]}>
          Place {catName} in front of the pet feeder and click the{' '}
          <Text style={typography.bodyBold}>'Start taking pictures'</Text> button.
        </Text>

        <Text style={[typography.bodySmall, styles.note]}>
          The built-in camera will take pictures of your cat for {COUNT_DOWN_S} seconds to
          train the cat recognition model.
        </Text>

        <Text style={[typography.bodyBold, styles.warning]}>
          Don't make the cat stand still, encourage movement!
        </Text>

        {capturing ? (
          <View style={styles.capturingContainer}>
            <ActivityIndicator size="large" color={colors.accent} />
            <Text style={[typography.h1, styles.countdown]}>{countdown}</Text>
            <Text style={[typography.body, { color: colors.stroke }]}>
              Capturing…
            </Text>
          </View>
        ) : (
          <TouchableOpacity style={styles.button} onPress={startCapture}>
            <Text style={styles.buttonText}>Start taking pictures</Text>
          </TouchableOpacity>
        )}

        <Text style={[typography.body, styles.progress]}>
          Cat {currentIndex + 1} of {total}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
  },
  catName: {
    color: colors.text,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  instructions: {
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  note: {
    color: colors.stroke,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 20,
  },
  warning: {
    color: colors.accent,
    textAlign: 'center',
    marginBottom: spacing.xxl,
  },
  capturingContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
    gap: spacing.md,
  },
  countdown: {
    color: colors.accent,
    fontWeight: '700',
  },
  button: {
    width: '100%',
    height: 52,
    backgroundColor: colors.accent,
    borderRadius: radius.input,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxl,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
  },
  progress: {
    color: colors.stroke,
    textAlign: 'center',
  },
});
