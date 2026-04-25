import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity } from 'react-native';

import { useToast } from '@/contexts';
import { registerDevice } from '@/services/devices';
import { colors, typography, common, spacing } from '@/style';

import type { RootStackParamList } from '@/types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'AddDevice'>;

export default function AddDeviceScreen({ navigation }: Props) {
  const [devices, setDevices] = useState([{ deviceId: '', name: '' }]);
  const [isPending, setIsPending] = useState(false);
  const { showToast } = useToast();

  const addRow = () => setDevices((prev) => [...prev, { deviceId: '', name: '' }]);

  const updateField = (index: number, field: 'name' | 'deviceId', value: string) => {
    setDevices((prev) => prev.map((d, i) => (i === index ? { ...d, [field]: value } : d)));
  };

  const removeRow = (index: number) => {
    setDevices((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNext = async () => {
    const filled = devices.filter((d) => d.name.trim() && d.deviceId.trim());
    if (filled.length === 0) {
      navigation.navigate('AddPet');
      return;
    }
    setIsPending(true);
    try {
      await Promise.all(filled.map((d) => registerDevice({ deviceId: d.deviceId.trim(), name: d.name.trim() })));
      navigation.navigate('AddPet');
    } catch (err: any) {
      showToast(err?.response?.data?.message ?? 'Failed to register device', 'error');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <View style={common.screenContainer}>
        <Text style={[typography.h2, common.title]}>Set up your feeder</Text>
        <Text style={[typography.bodySmall, styles.subtitle]}>
          Give your device a friendly name — if you have more than one feeder, this makes it easy to tell them apart.
        </Text>

        {devices.map((device, index) => (
          <View key={index} style={styles.inputRow}>
            <View style={styles.inputInner}>
              <TextInput
                style={[common.input, styles.inputText, { marginBottom: spacing.sm }]}
                placeholder={index === 0 ? 'Device Name (e.g. Living Room Feeder)' : 'Add Another Device'}
                placeholderTextColor={colors.stroke}
                value={device.name}
                onChangeText={(v) => updateField(index, 'name', v)}
              />
              {devices.length > 1 && index === devices.length - 1 && (
                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() => removeRow(index)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <MaterialIcons name="close" size={18} color={colors.stroke} />
                </TouchableOpacity>
              )}
            </View>
            <TextInput
              style={[common.input, { width: '90%' }]}
              placeholder="Device ID"
              placeholderTextColor={colors.stroke}
              value={device.deviceId}
              onChangeText={(v) => updateField(index, 'deviceId', v)}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Text style={styles.hint}>You can find it on the sticker on the back of your feeder.</Text>
          </View>
        ))}

        <TouchableOpacity style={styles.addMore} onPress={addRow}>
          <Text style={[typography.bodyBold, { color: colors.accent }]}>+ Add device</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Login')}>
          <MaterialIcons name="keyboard-backspace" size={24} color={colors.accent} />
          <Text style={[typography.bodySmall, { color: colors.accent, fontWeight: '500' }]}>Go Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
          disabled={isPending}
        >
          <Text style={[typography.bodyBold, { color: colors.background }]}>
            {isPending ? 'Saving…' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
