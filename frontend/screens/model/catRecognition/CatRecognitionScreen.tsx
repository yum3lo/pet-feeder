import { useState, useEffect } from 'react';
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
import { notificationEmitter } from '@/utils';

import type { RootStackParamList } from "@/types";
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'CatRecognition'>;

export default function CatRecognitionScreen({ navigation, route }: Props) {
  const { petNames, petIds, deviceId, currentIndex } = route.params;
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const [capturing, setCapturing] = useState(false);

  const petName = petNames[currentIndex];
  const total = petNames.length;

  useEffect(() => {
    return () => {
      notificationEmitter.removeAllListeners('photos_received');
    };
  }, []);

  const startCapture = async () => {
    try {
      await capturePhotos(deviceId, petIds[currentIndex]);
    } catch {
      showToast('Failed to send capture command', 'error');
      return;
    }

    setCapturing(true);

    const handler = (event: { petId: number }) => {
      if (event.petId !== petIds[currentIndex]) return;
      notificationEmitter.off('photos_received', handler);
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
    };

    notificationEmitter.on('photos_received', handler);
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
          The built-in camera will take pictures of your pet to
          train the pet recognition model.
        </Text>

        <Text style={[typography.bodyBold, styles.warning]}>
          Don't make the pet stand still, encourage movement!
        </Text>

        {capturing ? (
          <View style={styles.capturingContainer}>
            <ActivityIndicator size="large" color={colors.accent} />
            <Text style={[typography.body, { color: colors.stroke, marginTop: spacing.lg }]}>
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

