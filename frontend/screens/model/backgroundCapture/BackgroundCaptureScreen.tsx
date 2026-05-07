import { useState, useRef } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useToast } from '@/contexts';
import { useGetDevices, captureBackground } from '@/services/devices';
import { colors, typography, spacing } from '@/style';
import { toCapitalize } from '@/utils';

import Dropdown from '@/components/dropdown/Dropdown';

import type { RootStackParamList } from '@/types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { styles } from '../catRecognition/styles';

type Props = NativeStackScreenProps<RootStackParamList, 'BackgroundCapture'>;

const DURATION_INTERVAL_MS = 1000;
const COUNT_DOWN_S = 8;

export default function BackgroundCaptureScreen({ navigation, route }: Props) {
  const { petNames, petIds } = route.params;
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const { data: devices = [] } = useGetDevices();
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [capturing, setCapturing] = useState(false);
  const [countdown, setCountdown] = useState(COUNT_DOWN_S);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCapture = async () => {
    const deviceId = selectedDeviceId || devices[0]?.deviceId;
    if (deviceId) {
      try {
        const result = await captureBackground(deviceId);
        showToast(result.message, 'success');
      } catch {
        showToast('Failed to send capture command', 'error');
      }
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
        navigation.replace('CatRecognition', { petNames, petIds, deviceId: selectedDeviceId || devices[0]?.deviceId, currentIndex: 0 });
      }
    }, DURATION_INTERVAL_MS);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.xxl, paddingBottom: insets.top + spacing.xxl }]}>
      <View style={styles.content}>
        <Text style={[typography.h2, styles.catName]}>Background</Text>

        <Text style={[typography.body, styles.instructions]}>
          Point the camera at the area <Text style={typography.bodyBold}>around the feeder</Text> and click{' '}
          <Text style={typography.bodyBold}>'Start taking pictures'</Text>.
        </Text>

        <Text style={[typography.bodySmall, styles.note]}>
          Capturing background images for {COUNT_DOWN_S} seconds helps the model
          distinguish your pet from the environment and improves recognition accuracy.
        </Text>

        <Text style={[typography.bodyBold, styles.warning]}>
          Make sure no pets are in frame!
        </Text>

        {devices.length > 1 && (
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: spacing.xl }}>
            <Text style={[typography.bodySmall, { color: colors.stroke }]}>Choose a device</Text>
            <Dropdown
              options={devices.map((d) => ({ label: toCapitalize(d.name || d.deviceId), value: d.deviceId }))}
              value={selectedDeviceId || devices[0]?.deviceId}
              onSelect={setSelectedDeviceId}
              compact
              triggerTextStyle={{ color: colors.text }}
              triggerIconColor={colors.text}
            />
          </View>
        )}

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
      </View>
    </View>
  );
}
