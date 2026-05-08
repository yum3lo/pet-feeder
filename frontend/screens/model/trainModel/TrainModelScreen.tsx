import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackButton } from '@/components';
import { RECOGNITION_TRAINED_KEY } from '@/constants';
import { useToast } from '@/contexts';
import { trainModel } from '@/services/devices';
import { colors, typography, spacing } from '@/style';

import type { RootStackParamList } from "@/types";
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'TrainModel'>;

export default function TrainModelScreen({ navigation, route }: Props) {
  const deviceId = route.params?.deviceId ?? '';
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const [training, setTraining] = useState(false);
  const [done, setDone] = useState(false);

  const startTraining = async () => {
    setTraining(true);
    try {
      const result = await trainModel(deviceId);
      if (result.success) {
        await AsyncStorage.setItem(RECOGNITION_TRAINED_KEY, 'true');
        showToast('Successfully trained! Recognition is ready.', 'success');
        setDone(true);
      } else {
        showToast('Training completed but returned no success flag', 'error');
      }
    } catch {
      showToast('Training failed. Please try again.', 'error');
    } finally {
      setTraining(false);
    }
  };

  return (
    <>
      <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.top }]}>
        <View style={styles.content}>
          <MaterialIcons name="help" size={96} color={colors.accent} />

          <Text style={[typography.h2, styles.title]}>
            {done ? 'Training Complete!' : 'Ready to Train'}
          </Text>

          <Text style={[typography.body, styles.description]}>
            {done
              ? 'Your feeder can now recognize your pets individually. Feeding will be tracked per pet.'
              : 'Now that we have captured images of your pets, we can train the model to recognize them. This process may take a few minutes.'}
          </Text>

          {training ? (
            <View style={styles.trainingState}>
              <ActivityIndicator size="large" color={colors.accent} />
              <Text style={[typography.body, { color: colors.stroke, marginTop: spacing.lg }]}>
                Training in progress…
              </Text>
            </View>
          ) : done ? (
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.buttonText}>Back to Pet Profile</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.button} onPress={startTraining}>
              <Text style={styles.buttonText}>Start Training</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <BackButton label="Back to main app" onPress={() => navigation.navigate('Home')} />
    </>
  );
}

