import { useState, useRef } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useToast } from '@/contexts';
import { capturePhotos } from '@/services/devices';
import { colors, typography, spacing } from '@/style';

import type { RootStackParamList } from "@/types";
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'CatRecognition'>;

export default function CatRecognitionScreen({ navigation, route }: Props) {
  const { petNames, petIds, deviceId, currentIndex } = route.params;
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const [capturing, setCapturing] = useState(false);
  const [countdown, setCountdown] = useState(8);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const petName = petNames[currentIndex];
  const total = petNames.length;

  const DURATION_INTERVAL_MS = 1000;
  const COUNT_DOWN_S = 8;

  const startCapture = async () => {
    try {
      const result = await capturePhotos(deviceId, petIds[currentIndex]);
      showToast(result.message, 'success');
    } catch {
      showToast('Failed to send capture command', 'error');
    }

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
            petIds,
            deviceId,
            currentIndex: currentIndex + 1,
          });
        } else {
          navigation.replace('TrainModel', { deviceId });
        }
      }
    }, DURATION_INTERVAL_MS);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.xxl, paddingBottom: insets.top + spacing.xxl }]}>
      <View style={styles.content}>
        <Text style={[typography.h2, styles.catName]}>{petName}</Text>

        <Text style={[typography.body, styles.instructions]}>
          Place {petName} in front of the pet feeder and click the{' '}
          <Text style={typography.bodyBold}>'Start taking pictures'</Text> button.
        </Text>

        <Text style={[typography.bodySmall, styles.note]}>
          The built-in camera will take pictures of your pet for {COUNT_DOWN_S} seconds to
          train the pet recognition model.
        </Text>

        <Text style={[typography.bodyBold, styles.warning]}>
          Don't make the pet stand still, encourage movement!
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
          Pet {currentIndex + 1} of {total}
        </Text>
      </View>
    </View>
  );
}

