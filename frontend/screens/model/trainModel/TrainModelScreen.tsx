import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing } from '@/style';

import type { RootStackParamList } from "@/types";
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'TrainModel'>;

const TRAINING_TIME_MS = 3000;

export default function TrainModelScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [training, setTraining] = useState(false);
  const [done, setDone] = useState(false);

  const startTraining = () => {
    setTraining(true);
    setTimeout(() => {
      setTraining(false);
      setDone(true);
    }, TRAINING_TIME_MS);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        <MaterialIcons name="help" size={96} color={colors.accent} />

        <Text style={[typography.h2, styles.title]}>
          {done ? 'Training Complete!' : 'Ready to Train'}
        </Text>

        <Text style={[typography.body, styles.description]}>
          {done
            ? 'Your feeder can now recognize your cats individually. Feeding will be tracked per cat.'
            : 'Now that we have captured images of your cats, we can train the model to recognize them. This process may take a few minutes.'}
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
  );
}

